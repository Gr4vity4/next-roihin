'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Container from '@/components/ui/Container'
import Typography from '@/components/ui/Typography'
import { CircleCheck, Loader2 } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import type { OrderResource } from '@/lib/types/order'
import { formatRecipientName, getShippingAddressLines } from '@/lib/utils/shipping-address'
import { useProvinceLabel } from '@/hooks/useProvinces'

function formatCurrency(amountMinor: number, locale: string, currency: string): string {
  try {
    return new Intl.NumberFormat(locale === 'th' ? 'th-TH' : 'en-US', {
      style: 'currency',
      currency,
    }).format(amountMinor / 100)
  } catch {
    return `${currency} ${(amountMinor / 100).toFixed(2)}`
  }
}

function formatDate(value: string | null, locale: string): string {
  if (!value) {
    return '—'
  }

  try {
    const date = new Date(value)
    return new Intl.DateTimeFormat(locale === 'th' ? 'th-TH' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  } catch {
    return value
  }
}

export default function ThankYouContent() {
  const searchParams = useSearchParams()
  const t = useTranslations('thankYou')
  const tOrders = useTranslations('member.orders')
  const activeLocale = useLocale()
  const orderId = searchParams.get('order_id')
  const { clearCart } = useCart()
  const resolveProvince = useProvinceLabel(activeLocale)
  const hasCleared = useRef(false)

  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState<OrderResource | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!orderId) {
      setError('missing')
      setLoading(false)
      return
    }

    let isMounted = true

    async function loadOrder() {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/orders/${orderId}`, {
          cache: 'no-store',
          credentials: 'include',
        })

        if (response.status === 401) {
          throw new Error('unauthorized')
        }

        if (response.status === 404) {
          throw new Error('not_found')
        }

        if (!response.ok) {
          const body = await response.json().catch(() => ({}))
          throw new Error(body?.error || 'unknown')
        }

        const data = await response.json()
        if (isMounted) {
          setOrder(data?.data ?? null)
          setLoading(false)

          if (!hasCleared.current) {
            clearCart()
            hasCleared.current = true
          }
        }
      } catch (err) {
        if (!isMounted) return

        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('unknown')
        }
        setLoading(false)
      }
    }

    loadOrder()

    return () => {
      isMounted = false
    }
  }, [orderId, clearCart])

  const locale = (activeLocale === 'en' ? 'en' : 'th') as 'en' | 'th'

  const statusLabel = useMemo(() => {
    if (!order?.status) {
      return '—'
    }

    const key = order.status.toLowerCase()

    try {
      return tOrders(`tabs.${key}`)
    } catch {
      return order.status_label ?? order.status
    }
  }, [order?.status, order?.status_label, tOrders])

  if (loading) {
    return (
      <section className="pt-24 pb-12 md:pt-32 md:pb-16 min-h-screen bg-gray-50">
        <Container>
          <div className="max-w-3xl mx-auto flex flex-col items-center justify-center gap-4 py-24 text-gray-600">
            <Loader2 className="w-10 h-10 animate-spin" aria-hidden />
            <p>{t('loading')}</p>
          </div>
        </Container>
      </section>
    )
  }

  if (error || !order) {
    return (
      <section className="pt-24 pb-12 md:pt-32 md:pb-16 min-h-screen bg-gray-50">
        <Container>
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-12 text-center">
            <Typography variant="h3" className="text-gray-900 mb-4">
              {t('notFound.message')}
            </Typography>
            <Link
              href="/checkout"
              className="inline-block px-6 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-[#244323] transition-colors"
            >
              {t('notFound.backToCart')}
            </Link>
          </div>
        </Container>
      </section>
    )
  }

  const totalFormatted = formatCurrency(order.total_amount_minor, locale, order.currency)
  const subtotalFormatted = formatCurrency(order.subtotal_amount_minor, locale, order.currency)
  const shippingFormatted = formatCurrency(order.shipping_amount_minor, locale, order.currency)

  return (
    <section className="pt-24 pb-12 md:pt-32 md:pb-16 min-h-screen bg-gray-50">
      <Container>
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CircleCheck className="w-8 h-8 text-green-600" strokeWidth={2.5} aria-hidden />
            </div>
            <Typography variant="h3" className="text-gray-900 mb-2">
              {t('success.title')}
            </Typography>
            <p className="text-gray-600">{t('success.subtitle')}</p>
            <div className="mt-4 text-sm text-gray-500">
              <span className="font-medium text-gray-700">{t('success.orderNumber')}: </span>
              {order.order_number}
              <span className="mx-2">•</span>
              <span className="font-medium text-gray-700">{t('success.status')}:</span>{' '}
              <span className="text-green-700 font-semibold">{statusLabel}</span>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('orderDetails.title')}</h3>
                <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                  {order.items.map((item) => {
                    const color =
                      typeof item.options?.color === 'string' ? item.options.color : null

                    return (
                      <div key={item.id} className="flex justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium">{item.product_name}</p>
                          {color && (
                            <p className="text-sm text-gray-500">
                              {t('orderDetails.color')}: {color}
                            </p>
                          )}
                          <p className="text-sm text-gray-500">
                            {t('orderDetails.quantity')}: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right text-gray-900 font-medium">
                          {formatCurrency(item.subtotal_amount_minor, locale, order.currency)}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-6 space-y-2 border-t border-gray-200 pt-4 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>{t('orderDetails.subtotal')}</span>
                    <span className="text-gray-900 font-medium">{subtotalFormatted}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>{t('orderDetails.shipping')}</span>
                    <span className="text-gray-900 font-medium">
                      {order.shipping_amount_minor > 0 ? shippingFormatted : t('orderDetails.shippingFree')}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-900 font-semibold text-base mt-3">
                    <span>{t('orderDetails.total')}</span>
                    <span>{totalFormatted}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('shippingAddress.title')}</h3>
                {order.shipping_address ? (
                  <div className="text-sm text-gray-700 space-y-1">
                    <p className="font-medium text-gray-900">
                      {formatRecipientName(order.shipping_address)}
                    </p>
                    {getShippingAddressLines(order.shipping_address, resolveProvince).map(
                      (line, index) => (
                        <p key={`${index}-${line}`}>{line}</p>
                      )
                    )}
                    <p className="text-gray-500">
                      {t('orderDetails.phone', { defaultValue: 'Phone' })}: {order.shipping_address.phone}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">{t('shippingAddress.missing', { defaultValue: 'No shipping address available.' })}</p>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('paymentInfo.title')}</h3>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>
                    {t('paymentInfo.status', { defaultValue: 'Latest status:' })}{' '}
                    <span className="font-medium text-gray-900">
                      {formatDate(order.paid_at ?? order.placed_at, locale)}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-md p-6 text-center space-y-4">
                <Typography variant="h4" className="text-gray-900">
                  {t('success.nextSteps', { defaultValue: 'Need anything else?' })}
                </Typography>
                <p className="text-sm text-gray-600">
                  {t('success.contact', {
                    defaultValue: 'We will email you once your order ships. You can review all orders anytime in your account.',
                  })}
                </p>
                <div className="flex flex-col gap-3">
                  <Link
                    href="/"
                    className="inline-block px-6 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-[#244323] transition-colors"
                  >
                    {t('actions.backToHome')}
                  </Link>
                  <Link
                    href="/member/orders"
                    className="inline-block px-6 py-3 border border-green-600 text-green-700 font-medium rounded-md hover:bg-green-50 transition-colors"
                  >
                    {t('actions.viewOrders', { defaultValue: 'View My Orders' })}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
