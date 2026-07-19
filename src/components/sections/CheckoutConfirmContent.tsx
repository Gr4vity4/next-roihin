'use client'

import BraceletPreview from '@/components/BraceletPreview'
import Container from '@/components/ui/Container'
import AddressFields, { type AddressFieldValues } from '@/components/ui/AddressFields'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Typography from '@/components/ui/Typography'
import { combinePhone, splitPhone } from '@/lib/data/countries'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { Link, useRouter } from '@/i18n/navigation'
import { getDefaultAddress } from '@/lib/api/addresses.client'
import { fetchShippingZoneMatch, type ShippingZone } from '@/lib/api/shipping-zones'
import { getStripe } from '@/lib/stripe-client'
import type { CreateOrderPayload } from '@/lib/api/orders'
import { ArrowLeft } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'

interface ShippingFormState extends AddressFieldValues {
  email: string
}

const EMPTY_SHIPPING: ShippingFormState = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  address: '',
  apartment: '',
  postal_code: '',
  city: '',
  province: '',
}

// Shipping details from the shopper's most recent successful checkout, saved
// so repeat customers get a filled form even without a saved default address.
// Scoped to the user id so another account on a shared browser never sees them.
const LAST_SHIPPING_STORAGE_KEY = 'checkout_last_shipping'

interface StoredLastShipping {
  userId: number
  phoneCountry: string
  shipping: ShippingFormState
}

function readLastShipping(userId: number): StoredLastShipping | null {
  try {
    const raw = window.localStorage.getItem(LAST_SHIPPING_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredLastShipping | null
    if (!parsed || parsed.userId !== userId || !parsed.shipping) return null
    return parsed
  } catch (error) {
    console.error(`Error reading localStorage key "${LAST_SHIPPING_STORAGE_KEY}":`, error)
    return null
  }
}

function saveLastShipping(entry: StoredLastShipping) {
  try {
    window.localStorage.setItem(LAST_SHIPPING_STORAGE_KEY, JSON.stringify(entry))
  } catch (error) {
    console.error(`Error setting localStorage key "${LAST_SHIPPING_STORAGE_KEY}":`, error)
  }
}

export default function CheckoutConfirmContent() {
  const router = useRouter()
  const t = useTranslations('checkoutConfirm')
  const tCheckout = useTranslations('checkout')
  const { items, itemCount, totalAmount, isHydrated } = useCart()
  const { isLoggedIn, user } = useAuth()
  const locale = useLocale() as 'en' | 'th'
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderError, setOrderError] = useState<string>('')
  const [addressLoading, setAddressLoading] = useState(false)
  const [defaultAddressId, setDefaultAddressId] = useState<string | null>(null)
  const [phoneCountry, setPhoneCountry] = useState('th')
  const [shippingAddress, setShippingAddress] = useState<ShippingFormState>(EMPTY_SHIPPING)
  const [shippingZone, setShippingZone] = useState<ShippingZone | null>(null)
  const [shippingFeeStatus, setShippingFeeStatus] = useState<'loading' | 'ready' | 'error'>(
    'loading'
  )
  const hasPrefilledRef = useRef(false)
  // Caches a successfully created order's Stripe hand-off so a retry (Stripe
  // script failed to load, user hit Back from Stripe, etc.) reuses the same
  // order/session instead of creating a duplicate one.
  const createdCheckoutRef = useRef<{ url: string | null; sessionId: string | null } | null>(null)

  const addressLabels = useMemo(
    () => ({
      firstName: t('shippingAddress.firstName'),
      lastName: t('shippingAddress.lastName'),
      address: t('shippingAddress.address'),
      addressPlaceholder: t('shippingAddress.addressPlaceholder'),
      apartment: t('shippingAddress.apartment'),
      apartmentPlaceholder: t('shippingAddress.apartmentPlaceholder'),
      postalCode: t('shippingAddress.postalCode'),
      city: t('shippingAddress.city'),
      province: t('shippingAddress.province'),
      provincePlaceholder: t('shippingAddress.provincePlaceholder'),
      phone: t('shippingAddress.phone'),
      phonePlaceholder: t('shippingAddress.phonePlaceholder'),
    }),
    [t]
  )

  useEffect(() => {
    // Redirect if cart is empty — but only once the cart has hydrated from
    // localStorage. Acting on the pre-hydration placeholder (itemCount === 0)
    // would bounce shoppers off this page on every hard load / return from Stripe.
    if (isHydrated && itemCount === 0) {
      router.push('/checkout')
    }
  }, [isHydrated, itemCount, router])

  useEffect(() => {
    // When the page is restored from the bfcache (e.g. Back from Stripe), reset
    // the submit lock so the button isn't stuck on "Processing…" forever.
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        setIsProcessing(false)
      }
    }

    window.addEventListener('pageshow', handlePageShow)
    return () => window.removeEventListener('pageshow', handlePageShow)
  }, [])

  useEffect(() => {
    if (!isLoggedIn) {
      hasPrefilledRef.current = false
      return
    }

    // Prefill the saved default address only once per login. The `user`
    // reference changes on every auth heartbeat (mount, 60s interval, window
    // focus, visibilitychange); without this guard each change would re-fetch
    // and silently overwrite the shopper's in-progress edits.
    if (hasPrefilledRef.current) return
    hasPrefilledRef.current = true

    const accountEmail = user?.email || ''

    // No saved default address (or it failed to load): fall back to the
    // details from the shopper's previous checkout, then to just their
    // account email, so repeat customers never start from a blank form.
    const applyFallbackPrefill = () => {
      const stored = user ? readLastShipping(user.id) : null
      if (stored) {
        setPhoneCountry(stored.phoneCountry || 'th')
        setShippingAddress({
          ...EMPTY_SHIPPING,
          ...stored.shipping,
          email: stored.shipping.email || accountEmail,
        })
        return
      }
      if (accountEmail) {
        setShippingAddress((prev) => (prev.email ? prev : { ...prev, email: accountEmail }))
      }
    }

    const fetchDefaultAddress = async () => {
      setAddressLoading(true)
      try {
        const { hasDefault, id, item } = await getDefaultAddress()

        if (hasDefault && item) {
          setDefaultAddressId(id)
          const parsedPhone = splitPhone(item.phone)
          setPhoneCountry(parsedPhone.country)
          setShippingAddress({
            first_name: item.first_name,
            last_name: item.last_name,
            email: accountEmail,
            phone: parsedPhone.phone,
            address: item.address,
            apartment: item.apartment ?? '',
            postal_code: item.postal_code,
            city: item.city,
            province: item.province,
          })
        } else {
          setDefaultAddressId(null)
          applyFallbackPrefill()
        }
      } catch (error) {
        console.error('Failed to fetch default address:', error)
        applyFallbackPrefill()
      } finally {
        setAddressLoading(false)
      }
    }

    fetchDefaultAddress()
  }, [isLoggedIn, user])

  // Re-price shipping whenever the dial-code country changes. The country is
  // the only address signal at checkout (there is no dedicated country field);
  // the cancelled flag stops a slow response for a previous country from
  // overwriting the fee of the current one.
  useEffect(() => {
    let cancelled = false

    const matchZone = async () => {
      setShippingFeeStatus('loading')
      try {
        const zone = await fetchShippingZoneMatch(phoneCountry.toUpperCase())
        if (cancelled) return
        setShippingZone(zone)
        setShippingFeeStatus('ready')
      } catch (error) {
        if (cancelled) return
        console.error('Failed to match shipping zone:', error)
        setShippingZone(null)
        setShippingFeeStatus('error')
      }
    }

    matchZone()

    return () => {
      cancelled = true
    }
  }, [phoneCountry])

  const shippingFee = shippingZone ? shippingZone.fee_minor / 100 : 0
  const orderTotal = totalAmount + shippingFee

  // Any edit to the prefilled address (field or dial code) invalidates the
  // saved-address reference: the backend ships to the shipping_address_id
  // record when one is present, which would silently discard the edits.
  const handleFieldChange = (field: keyof AddressFieldValues, value: string) => {
    setDefaultAddressId(null)
    setShippingAddress((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePhoneCountryChange = (code: string) => {
    setDefaultAddressId(null)
    setPhoneCountry(code)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // The submit button is disabled until the fee resolves, but guard against
    // implicit form submission (Enter key) racing the zone fetch — charging
    // ฿0 shipping on an international order is worse than a blocked click.
    if (!shippingZone || shippingFeeStatus !== 'ready') {
      return
    }

    setIsProcessing(true)
    setOrderError('')

    // Reuse an already-created order's checkout hand-off if the shopper is
    // retrying after a post-order failure, so we never create a second order.
    // If the reuse itself fails, surface the error and let them retry the reuse
    // rather than falling through to create a duplicate.
    const existingCheckout = createdCheckoutRef.current
    if (existingCheckout) {
      try {
        if (existingCheckout.url) {
          window.location.href = existingCheckout.url
          return
        }
        if (existingCheckout.sessionId) {
          const stripe = await getStripe()
          if (!stripe) {
            throw new Error('Stripe failed to load')
          }
          const { error } = await stripe.redirectToCheckout({
            sessionId: existingCheckout.sessionId,
          })
          if (error) {
            throw error
          }
          return
        }
      } catch (error) {
        console.error('Checkout retry failed:', error)
        setOrderError(t('errors.checkoutFailed'))
        setIsProcessing(false)
        return
      }
    }

    try {
      const payload: CreateOrderPayload = {
        items: items.map((item) => {
          // Cart ids are composite (`${productId}-${color}`, `${productId}-default`,
          // or a bracelet designId), so the numeric product id is the leading
          // segment. Custom bracelets have no catalog product id.
          const numericId = Number(String(item.id).split('-')[0])
          const productId =
            !item.isCustomBracelet && Number.isFinite(numericId) ? numericId : undefined

          return {
            product_id: productId ?? undefined,
            product_name: item.title,
            sku: item.slug,
            unit_price_minor: Math.round(item.price * 100),
            quantity: item.quantity,
            options: {
              image: item.image,
              color: item.color,
              category: item.category,
              slug: item.slug,
              isCustomBracelet: item.isCustomBracelet,
              braceletDesign: item.braceletDesign ?? null,
            },
          }
        }),
        shipping_address: {
          first_name: shippingAddress.first_name,
          last_name: shippingAddress.last_name,
          phone: combinePhone(phoneCountry, shippingAddress.phone),
          address: shippingAddress.address,
          apartment: shippingAddress.apartment.trim() ? shippingAddress.apartment : null,
          city: shippingAddress.city,
          province: shippingAddress.province,
          postal_code: shippingAddress.postal_code,
          email: shippingAddress.email,
        },
        currency: 'THB',
        shipping_amount_minor: shippingZone.fee_minor,
        discount_amount_minor: 0,
        metadata: {
          cart_source: 'web',
          cart_total_items: itemCount,
          shipping_zone: shippingZone.code,
          shipping_country: phoneCountry.toUpperCase(),
        },
        locale,
      }

      if (defaultAddressId) {
        const parsed = Number(defaultAddressId)
        if (Number.isFinite(parsed)) {
          payload.shipping_address_id = parsed
        }
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include',
      })

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}))
        throw new Error(errorBody?.error || 'Failed to create order')
      }

      const data = await response.json()
      const checkoutUrl: string | null = data?.stripe?.checkout_url ?? null
      const sessionId: string | null = data?.stripe?.checkout_session_id ?? null

      // The order now exists in the backend. Remember its hand-off so a retry
      // after a Stripe failure doesn't create a duplicate order.
      createdCheckoutRef.current = { url: checkoutUrl, sessionId }

      // Remember what the shopper used so their next checkout is prefilled
      // even without a saved default address.
      if (user) {
        saveLastShipping({ userId: user.id, phoneCountry, shipping: shippingAddress })
      }

      if (checkoutUrl) {
        window.location.href = checkoutUrl
        return
      }

      if (sessionId) {
        const stripe = await getStripe()
        if (!stripe) {
          throw new Error('Stripe failed to load')
        }

        const { error } = await stripe.redirectToCheckout({ sessionId })

        if (error) {
          throw error
        }

        return
      }

      throw new Error('Missing checkout session information')
    } catch (error) {
      console.error('Checkout failed:', error)
      setOrderError(t('errors.checkoutFailed'))
      setIsProcessing(false)
    }
  }

  const isFormValid = () => {
    return (
      shippingAddress.first_name &&
      shippingAddress.last_name &&
      shippingAddress.email &&
      shippingAddress.phone &&
      shippingAddress.address &&
      shippingAddress.city &&
      shippingAddress.province &&
      shippingAddress.postal_code
    )
  }

  if (itemCount === 0) {
    return null
  }

  return (
    <section className="pt-24 pb-12 md:pt-32 md:pb-16 min-h-screen bg-gray-50 font-prompt">
      <Container>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/checkout"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label={t('backToCart')}
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <Typography variant="h3" className="text-gray-900">
              {t('title')}
            </Typography>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Shipping Address */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {t('shippingAddress.title')}
                    </h3>
                    {addressLoading && (
                      <span className="text-sm text-gray-500">{t('loadingAddress')}</span>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        {t('shippingAddress.email')} {t('payment.required')}
                      </Label>
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        value={shippingAddress.email}
                        onChange={(e) =>
                          setShippingAddress((prev) => ({ ...prev, email: e.target.value }))
                        }
                        required
                      />
                    </div>

                    <AddressFields
                      values={shippingAddress}
                      onFieldChange={handleFieldChange}
                      labels={addressLabels}
                      locale={locale}
                      phoneCountry={phoneCountry}
                      onPhoneCountryChange={handlePhoneCountryChange}
                      requiredMarker={t('payment.required')}
                      idPrefix="ship_"
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">{t('payment.title')}</h3>

                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 border-2 border-blue-500 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <svg
                          className="w-8 h-8"
                          viewBox="0 0 60 25"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill="#635bff"
                            d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.48zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.12.87V5.57h3.76l.08 1.02a4.7 4.7 0 0 1 3.23-1.29c2.9 0 5.62 2.6 5.62 7.4 0 5.23-2.7 7.6-5.65 7.6zM40 8.95c-.95 0-1.54.34-1.97.81l.02 6.12c.4.44.98.78 1.95.78 1.52 0 2.54-1.65 2.54-3.87 0-2.15-1.04-3.84-2.54-3.84zM28.24 5.57h4.13v14.44h-4.13V5.57zm0-4.7L32.37 0v3.36l-4.13.88V.88zm-4.32 9.35v9.79H19.8V5.57h3.7l.12 1.22c1-1.77 3.07-1.41 3.62-1.22v3.79c-.52-.17-2.29-.43-3.32.86zm-8.55 4.72c0 2.43 2.6 1.68 3.12 1.46v3.36c-.55.3-1.54.54-2.89.54a4.15 4.15 0 0 1-4.27-4.24l.01-13.17 4.02-.86v3.54h3.14V9.1h-3.13v5.85zm-4.91.7c0 2.97-2.31 4.66-5.73 4.66a11.2 11.2 0 0 1-4.46-.93v-3.93c1.38.75 3.1 1.31 4.46 1.31.92 0 1.53-.24 1.53-1C6.26 13.77 0 14.51 0 9.95 0 7.04 2.28 5.3 5.62 5.3c1.36 0 2.72.2 4.09.75v3.88a9.23 9.23 0 0 0-4.1-1.06c-.86 0-1.44.25-1.44.93 0 1.85 6.29.97 6.29 5.88z"
                          />
                        </svg>
                        <p className="font-medium text-gray-900">{t('payment.stripe')}</p>
                      </div>
                      <p className="text-sm text-gray-600">{t('payment.stripeDescription')}</p>
                    </div>

                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-sm text-gray-700">{t('payment.securePayment')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                  <h2 className="text-xl text-gray-900 font-semibold mb-6">
                    {tCheckout('orderSummary.title')}
                  </h2>

                  {/* Order Items */}
                  <div className="space-y-3 pb-4 mb-4 border-b border-gray-200 max-h-64 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                          {item.isCustomBracelet && item.braceletDesign ? (
                            <BraceletPreview
                              beads={item.braceletDesign.beads}
                              wristLength={item.braceletDesign.wristLength}
                              className="w-full h-full bg-white p-0.5"
                            />
                          ) : (
                            <Image src={item.image} alt={item.title} fill className="object-cover" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                          {item.color && (
                            <p className="text-xs text-gray-500">
                              {t('orderItems.color')}: {item.color}
                            </p>
                          )}
                          {item.isCustomBracelet && item.braceletDesign && (
                            <div className="mt-1 text-xs text-gray-600 space-y-0.5">
                              <p>
                                • {item.braceletDesign.beads.length} {t('orderItems.stones')}
                              </p>
                              <p>
                                • {t('orderItems.wrist')}: {item.braceletDesign.wristLength} cm
                              </p>
                              <p>
                                • {t('orderItems.beadSize')}: {item.braceletDesign.beadSize} mm
                              </p>
                            </div>
                          )}
                          <p className="text-xs text-gray-600 mt-1">
                            {item.quantity} x ฿{item.price.toLocaleString('th-TH')}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          ฿{(item.price * item.quantity).toLocaleString('th-TH')}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 pb-4 border-b border-gray-200">
                    <div className="flex justify-between text-gray-600">
                      <span>
                        {tCheckout('orderSummary.subtotal')} ({itemCount}{' '}
                        {itemCount === 1
                          ? tCheckout('cartSummary.items')
                          : tCheckout('cartSummary.items_plural')}
                        )
                      </span>
                      <span className="font-medium text-gray-900">
                        ฿{totalAmount.toLocaleString('th-TH')}
                      </span>
                    </div>
                    <div className="text-gray-600">
                      <div className="flex justify-between">
                        <span>{tCheckout('orderSummary.shipping')}</span>
                        {shippingFeeStatus === 'loading' ? (
                          <span className="text-gray-400">
                            {tCheckout('orderSummary.shippingCalculating')}
                          </span>
                        ) : shippingFeeStatus === 'error' ? (
                          <span className="text-sm text-red-500">
                            {tCheckout('orderSummary.shippingUnavailable')}
                          </span>
                        ) : shippingFee === 0 ? (
                          <span className="text-green-600 font-medium">
                            {tCheckout('orderSummary.shippingFree')}
                          </span>
                        ) : (
                          <span className="font-medium text-gray-900">
                            ฿{shippingFee.toLocaleString('th-TH')}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-gray-400">
                        {tCheckout('orderSummary.shippingNote')}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 pb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-900 text-lg font-semibold">
                        {tCheckout('orderSummary.total')}
                      </span>
                      <span className="text-2xl font-bold text-gray-900">
                        ฿{orderTotal.toLocaleString('th-TH')}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing || !isFormValid() || shippingFeeStatus !== 'ready'}
                    className={`w-full px-6 py-4 font-medium rounded-md transition-all transform hover:scale-105 shadow-lg ${
                      isProcessing || !isFormValid() || shippingFeeStatus !== 'ready'
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isProcessing ? t('actions.processing') : t('actions.proceedToPayment')}
                  </button>

                  {!isFormValid() && (
                    <p className="text-xs text-red-500 mt-2 text-center">
                      {t('actions.formIncomplete')}
                    </p>
                  )}

                  {orderError && (
                    <p className="text-sm text-red-500 mt-2 text-center">{orderError}</p>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </Container>
    </section>
  )
}
