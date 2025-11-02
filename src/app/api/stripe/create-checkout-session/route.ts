import { NextRequest, NextResponse } from 'next/server'
import { getStripeClient } from '@/lib/stripe'
import Stripe from 'stripe'

interface BraceletBead {
  id: string
  stoneName: string
  stoneImage?: string
  size: number
  price: number
}

interface BraceletDesign {
  beads: BraceletBead[]
  wristLength: string
  beadSize: number
  totalPrice: number
  designId: string
  designImageUrl?: string
}

interface CheckoutItem {
  id: string
  title: string
  price: number
  quantity: number
  image: string
  isCustomBracelet?: boolean
  braceletDesign?: BraceletDesign
}

interface ShippingAddress {
  fullName: string
  email: string
  phone: string
  address: string
  district: string
  province: string
  postalCode: string
}

interface CheckoutSessionRequest {
  items: CheckoutItem[]
  shippingAddress: ShippingAddress
  locale: string
}

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripeClient()
    const body: CheckoutSessionRequest = await request.json()
    const { items, shippingAddress, locale } = body

    // Validate required fields
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      )
    }

    if (!shippingAddress || !shippingAddress.email) {
      return NextResponse.json(
        { error: 'Shipping address is required' },
        { status: 400 }
      )
    }

    // Convert cart items to Stripe line items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => {
      // Build description for custom bracelets
      let description = undefined
      if (item.isCustomBracelet && item.braceletDesign) {
        description = `Custom Bracelet - ${item.braceletDesign.beads.length} stones, Wrist: ${item.braceletDesign.wristLength}cm, Bead size: ${item.braceletDesign.beadSize}mm`
      }

      return {
        price_data: {
          currency: 'thb',
          product_data: {
            name: item.title,
            images: item.image ? [item.image] : [],
            description: description,
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents/satang
        },
        quantity: item.quantity,
      }
    })

    // Prepare metadata with custom bracelet details if present
    const metadata: Record<string, string> = {
      fullName: shippingAddress.fullName,
      phone: shippingAddress.phone,
      address: shippingAddress.address,
      district: shippingAddress.district,
      province: shippingAddress.province,
      postalCode: shippingAddress.postalCode,
      locale: locale,
    }

    // Add custom bracelet designs to metadata (for order fulfillment)
    const customBracelets = items.filter(item => item.isCustomBracelet && item.braceletDesign)
    if (customBracelets.length > 0) {
      metadata.hasCustomBracelets = 'true'
      metadata.customBraceletDetails = JSON.stringify(
        customBracelets.map(item => ({
          itemId: item.id,
          designId: item.braceletDesign?.designId,
          wristLength: item.braceletDesign?.wristLength,
          beadSize: item.braceletDesign?.beadSize,
          beadCount: item.braceletDesign?.beads.length,
          designImageUrl: item.braceletDesign?.designImageUrl,
          beads: item.braceletDesign?.beads.map(bead => ({
            stoneName: bead.stoneName,
            size: bead.size,
            price: bead.price,
          })),
        }))
      )
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/checkout/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/checkout/confirm`,
      customer_email: shippingAddress.email,
      metadata: metadata,
      shipping_address_collection: {
        allowed_countries: ['TH'],
      },
      phone_number_collection: {
        enabled: true,
      },
      billing_address_collection: 'required',
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url
    })
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
