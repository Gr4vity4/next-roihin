import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'

interface CheckoutItem {
  id: string
  title: string
  price: number
  quantity: number
  image: string
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
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => ({
      price_data: {
        currency: 'thb',
        product_data: {
          name: item.title,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents/satang
      },
      quantity: item.quantity,
    }))

    // Split full name into first and last name
    const nameParts = shippingAddress.fullName.trim().split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/checkout/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/checkout/confirm`,
      customer_email: shippingAddress.email,
      metadata: {
        // Store shipping address and order info in metadata for webhook processing
        fullName: shippingAddress.fullName,
        phone: shippingAddress.phone,
        address: shippingAddress.address,
        district: shippingAddress.district,
        province: shippingAddress.province,
        postalCode: shippingAddress.postalCode,
        locale: locale,
      },
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