import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
let stripeClient: Stripe | null = null

export function getStripeClient(): Stripe {
  if (!stripeSecretKey) {
    throw new Error('STRIPE_SECRET_KEY is not defined in environment variables')
  }

  if (!stripeClient) {
    stripeClient = new Stripe(stripeSecretKey, {
      apiVersion: '2025-08-27.basil',
      typescript: true,
    })
  }

  return stripeClient
}
