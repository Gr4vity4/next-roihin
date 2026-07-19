import { NextRequest, NextResponse } from 'next/server'
import { getStripeClient } from '@/lib/stripe'
import Stripe from 'stripe'
import type { OrderCreateRequest } from '@/lib/types/order'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature found' },
      { status: 400 }
    )
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('STRIPE_WEBHOOK_SECRET is not configured')
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    )
  }

  let event: Stripe.Event
  let stripe: Stripe

  try {
    // Verify webhook signature
    stripe = getStripeClient()

    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // Retrieve session with line items and shipping details
        const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
          session.id,
          {
            expand: [
              'line_items',
              'line_items.data.price.product',
              'shipping_details'
            ]
          }
        )

        // Create order in your backend
        await createOrderFromSession(sessionWithLineItems)
        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('Payment succeeded:', paymentIntent.id)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.error('Payment failed:', paymentIntent.id)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

// Extended Session type to include shipping_details which exists at runtime when expanded
interface ExtendedSession extends Stripe.Checkout.Session {
  shipping_details?: {
    name?: string | null
    phone?: string | null
    address?: {
      line1?: string | null
      line2?: string | null
      city?: string | null
      state?: string | null
      postal_code?: string | null
      country?: string | null
    } | null
  } | null
}

async function createOrderFromSession(session: Stripe.Checkout.Session) {
  try {
    const metadata = session.metadata || {}
    // Access shipping_details which is available when session is expanded
    const extendedSession = session as ExtendedSession
    const shippingDetails = extendedSession.shipping_details || session.customer_details

    if (!shippingDetails) {
      throw new Error('No shipping details found in session')
    }

    // Get line items
    const lineItems = session.line_items?.data || []

    if (lineItems.length === 0) {
      throw new Error('No line items found in session')
    }

    // Parse shipping address from metadata or session
    const fullName = metadata.fullName || shippingDetails.name || ''
    const nameParts = fullName.trim().split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || nameParts[0] || ''

    // Prepare order items
    const orderItems = lineItems.map((item) => {
      const product = item.price?.product as Stripe.Product | undefined
      const productId = product?.metadata?.product_id || '0'

      return {
        product_id: parseInt(productId),
        quantity: item.quantity || 1,
        price: item.price?.unit_amount ? item.price.unit_amount / 100 : 0,
        total: item.amount_total / 100,
      }
    })

    // Calculate totals
    const subtotal = session.amount_subtotal ? session.amount_subtotal / 100 : 0
    const total = session.amount_total ? session.amount_total / 100 : 0

    // Prepare order data
    const orderData: OrderCreateRequest = {
      items: orderItems,
      billing: {
        first_name: firstName,
        last_name: lastName,
        email: session.customer_email || session.customer_details?.email || '',
        phone: metadata.phone || shippingDetails.phone || '',
        address_1: metadata.address || shippingDetails.address?.line1 || '',
        address_2: shippingDetails.address?.line2 || '',
        city: metadata.district || shippingDetails.address?.city || '',
        state: metadata.province || shippingDetails.address?.state || '',
        postcode: metadata.postalCode || shippingDetails.address?.postal_code || '',
        country: shippingDetails.address?.country || 'TH',
      },
      payment_method: 'bacs',
      shipping_total: 0,
      total,
      subtotal,
      note: `Stripe Payment ID: ${session.payment_intent}`,
    }

    // Create order via internal API.
    //
    // TODO(payments): This server-to-server call has no user session, so it
    // cannot use the `authToken` cookie that POST /api/orders (and the Laravel
    // backend) require — the call currently 401s and no order is recorded for a
    // paid session. A proper fix needs a shared service credential: set
    // STRIPE_ORDER_SERVICE_TOKEN here AND have the backend accept it as a trusted
    // service caller. Until that exists on the backend, this webhook is not a
    // working fulfillment path (the live flow creates the order via /api/orders
    // before redirecting to Stripe). Do not rely on it.
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
    const serviceToken = process.env.STRIPE_ORDER_SERVICE_TOKEN
    const response = await fetch(`${apiUrl}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(serviceToken ? { Authorization: `Bearer ${serviceToken}` } : {}),
      },
      body: JSON.stringify(orderData),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to create order: ${error}`)
    }

    const orderResponse = await response.json()
    console.log('Order created successfully:', orderResponse.order?.order_id)

    return orderResponse
  } catch (error) {
    console.error('Error creating order from Stripe session:', error)
    throw error
  }
}
