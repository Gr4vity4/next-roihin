# Stripe Payment Integration Setup Guide

## Overview

This guide will help you set up Stripe payment gateway integration for the ROIHIN e-commerce application.

## Prerequisites

1. A Stripe account (sign up at https://stripe.com)
2. Node.js and npm installed
3. Access to your `.env.local` file

## Step 1: Get Your Stripe API Keys

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers > API keys**
3. You'll find two types of keys:
   - **Publishable key** (starts with `pk_test_` for test mode or `pk_live_` for production)
   - **Secret key** (starts with `sk_test_` for test mode or `sk_live_` for production)

⚠️ **Important**: Never expose your secret key in client-side code or commit it to version control!

## Step 2: Configure Environment Variables

Add the following to your `.env.local` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret_here
```

### For Development (Test Mode)
- Use keys starting with `sk_test_` and `pk_test_`
- Test card numbers: https://stripe.com/docs/testing

### For Production (Live Mode)
- Use keys starting with `sk_live_` and `pk_live_`
- Ensure your Stripe account is fully activated

## Step 3: Set Up Webhook Endpoint

Webhooks allow Stripe to notify your application when payment events occur.

### Local Development with Stripe CLI

1. **Install Stripe CLI**: https://stripe.com/docs/stripe-cli
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe

   # Windows
   scoop install stripe
   ```

2. **Login to Stripe CLI**:
   ```bash
   stripe login
   ```

3. **Forward webhooks to your local server**:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

4. **Copy the webhook signing secret** from the CLI output (starts with `whsec_`)
5. **Update your `.env.local`**:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_xxx_from_cli_output
   ```

### Production Webhook Setup

1. Go to **Developers > Webhooks** in your Stripe Dashboard
2. Click **Add endpoint**
3. Enter your webhook URL: `https://yourdomain.com/api/stripe/webhook`
4. Select events to listen to:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the **Signing secret** and add it to your production environment variables

## Step 4: Test the Integration

### Test Cards

Use these test card numbers in test mode:

| Card Number | Description |
|-------------|-------------|
| 4242 4242 4242 4242 | Successful payment |
| 4000 0025 0000 3155 | Requires authentication (3D Secure) |
| 4000 0000 0000 9995 | Declined payment |

- Use any future expiration date (e.g., 12/34)
- Use any 3-digit CVC
- Use any postal code

### Testing Workflow

1. Add items to your cart
2. Go to checkout (`/checkout`)
3. Click "Proceed to Checkout" to go to confirmation page
4. Fill in shipping address
5. Click "Proceed to Payment"
6. You'll be redirected to Stripe Checkout
7. Enter test card details
8. Complete payment
9. You'll be redirected back to the thank you page

### Verify in Stripe Dashboard

1. Go to **Payments** in your Stripe Dashboard
2. You should see your test payment
3. Check **Developers > Webhooks** to see webhook events

## Step 5: Currency Configuration

The integration is configured for Thai Baht (THB). To change the currency:

1. Edit `/src/app/api/stripe/create-checkout-session/route.ts`
2. Change the `currency` field in line 50:
   ```typescript
   currency: 'thb', // Change to 'usd', 'eur', etc.
   ```

## Troubleshooting

### Webhook Not Receiving Events

- Ensure your webhook endpoint is publicly accessible
- Check the webhook signing secret is correct
- Verify events are being sent in Stripe Dashboard > Webhooks
- Check your server logs for errors

### Payment Not Completing

- Verify your Stripe keys are correct
- Check browser console for JavaScript errors
- Ensure `NEXT_PUBLIC_BASE_URL` is set correctly for redirects

### Orders Not Being Created

- Check webhook logs in `/api/stripe/webhook`
- Verify the order creation API is working
- Ensure metadata is being passed correctly in the checkout session

## Security Best Practices

1. ✅ Never expose `STRIPE_SECRET_KEY` in client-side code
2. ✅ Always verify webhook signatures
3. ✅ Use HTTPS in production
4. ✅ Validate webhook events on the server side
5. ✅ Store sensitive data securely
6. ✅ Use environment variables for all secrets

## Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Checkout Guide](https://stripe.com/docs/payments/checkout)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Webhook Best Practices](https://stripe.com/docs/webhooks/best-practices)

## Support

If you encounter issues:
1. Check Stripe Dashboard logs
2. Review server logs for errors
3. Consult Stripe documentation
4. Contact Stripe support if needed