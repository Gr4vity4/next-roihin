'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Button from '@/components/Button'
import type { OrderResource } from '@/lib/types/order'
import { ArrowLeft, Package, MapPin, CreditCard, Clock } from 'lucide-react'

interface OrderDetailResponseBody {
  data?: OrderResource
  error?: string
}

function getStatusPillColor(status: string): string {
  switch (status) {
    case 'delivered':
      return 'bg-green-100 text-green-800'
    case 'processing':
      return 'bg-yellow-100 text-yellow-800'
    case 'pending':
      return 'bg-amber-100 text-amber-800'
    case 'shipped':
      return 'bg-blue-100 text-blue-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function formatCurrency(amountMinor: number, currency: string, locale: string): string {
  const normalizedLocale = locale === 'th' ? 'th-TH' : 'en-US'
  try {
    return new Intl.NumberFormat(normalizedLocale, {
      style: 'currency',
      currency: currency || 'THB',
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

function formatOrderDate(value: string | null, locale: string): string {
  if (!value) {
    return '—'
  }

  try {
    const date = new Date(value)
    return new Intl.DateTimeFormat(locale === 'th' ? 'th-TH' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date)
  } catch {
    return value
  }
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('member.orders')
  const tThankYou = useTranslations('thankYou')

  const orderId = params.id as string

  const [order, setOrder] = useState<OrderResource | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadOrder() {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/orders/${orderId}`, { cache: 'no-store' })

        if (response.status === 401) {
          if (!isMounted) return
          setError('unauthorized')
          return
        }

        if (response.status === 404) {
          if (!isMounted) return
          setError('not_found')
          return
        }

        const body: OrderDetailResponseBody = await response.json()

        if (!response.ok) {
          throw new Error(body?.error || 'FAILED')
        }

        if (!isMounted) return
        setOrder(body?.data ?? null)
      } catch (err) {
        if (!isMounted) return
        setError(err instanceof Error ? err.message : 'unknown')
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadOrder()

    return () => {
      isMounted = false
    }
  }, [orderId])

  const renderStatusChip = (status: string, fallback?: string | null) => {
    const normalized = status?.toLowerCase?.() ?? ''
    try {
      return t(`tabs.${normalized}`)
    } catch {
      return fallback ?? status ?? '—'
    }
  }

  const totalFormatted = useMemo(() => {
    if (!order) return '—'
    return formatCurrency(order.total_amount_minor, order.currency, locale)
  }, [order, locale])

  const subtotalFormatted = useMemo(() => {
    if (!order) return '—'
    return formatCurrency(order.subtotal_amount_minor, order.currency, locale)
  }, [order, locale])

  const shippingFormatted = useMemo(() => {
    if (!order) return '—'
    return formatCurrency(order.shipping_amount_minor, order.currency, locale)
  }, [order, locale])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto pt-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center text-gray-500">
          {t('loading')}
        </div>
      </div>
    )
  }

  if (error === 'unauthorized') {
    return (
      <div className="max-w-7xl mx-auto pt-8">
        <div className="bg-white rounded-xl shadow-sm border border-red-100 p-10 text-center">
          <p className="text-red-600 font-medium mb-4">{t('errors.unauthorized')}</p>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (error === 'not_found' || !order) {
    return (
      <div className="max-w-7xl mx-auto pt-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Order Not Found</h3>
          <p className="text-gray-500 mb-6">The order you're looking for doesn't exist or you don't have permission to view it.</p>
          <Link href="/member/orders">
            <Button>Back to Orders</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto pt-8">
        <div className="bg-white rounded-xl shadow-sm border border-red-100 p-10 text-center">
          <p className="text-red-600 font-medium">{t('errors.loadFailed')}</p>
        </div>
      </div>
    )
  }

  const status = order.status?.toLowerCase?.() ?? ''
  const orderDate = formatOrderDate(order.placed_at, locale)

  return (
    <div className="max-w-7xl mx-auto pt-8 pb-12">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/member/orders">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            {t('detail.backToOrders')}
          </Button>
        </Link>
      </div>

      {/* Order Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex items-center flex-wrap gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{order.order_number}</h1>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusPillColor(status)}`}>
                {renderStatusChip(status, order.status_label)}
              </span>
            </div>
            <p className="text-sm text-gray-600">{t('orderCard.orderedOn', { date: orderDate })}</p>
            {order.tracking_number && (
              <p className="text-sm text-gray-600 mt-1">
                {t('orderCard.tracking', { number: order.tracking_number })}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-1">{t('detail.totalAmount')}</p>
            <p className="text-3xl font-bold text-gray-900">{totalFormatted}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                {tThankYou('orderDetails.title', { defaultValue: 'Order Items' })}
              </h3>
            </div>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{item.product_name}</p>
                    {item.options?.color && (
                      <p className="text-sm text-gray-500">
                        {tThankYou('orderDetails.color', { defaultValue: 'Color' })}: {item.options.color as string}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">
                      {tThankYou('orderDetails.quantity', { defaultValue: 'Quantity' })}: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-900 font-medium">
                      {formatCurrency(item.subtotal_amount_minor, order.currency, locale)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-6 space-y-2 border-t border-gray-200 pt-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>{tThankYou('orderDetails.subtotal', { defaultValue: 'Subtotal' })}</span>
                <span className="text-gray-900 font-medium">{subtotalFormatted}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>{tThankYou('orderDetails.shipping', { defaultValue: 'Shipping' })}</span>
                <span className="text-gray-900 font-medium">
                  {order.shipping_amount_minor > 0
                    ? shippingFormatted
                    : tThankYou('orderDetails.shippingFree', { defaultValue: 'Free' })}
                </span>
              </div>
              {order.discount_amount_minor > 0 && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{t('detail.discount')}</span>
                  <span className="text-green-600 font-medium">
                    -{formatCurrency(order.discount_amount_minor, order.currency, locale)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-base text-gray-900 font-semibold pt-2 border-t border-gray-200">
                <span>{tThankYou('orderDetails.total', { defaultValue: 'Total' })}</span>
                <span>{totalFormatted}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                {tThankYou('shippingAddress.title', { defaultValue: 'Shipping Address' })}
              </h3>
            </div>
            {order.shipping_address ? (
              <div className="text-sm text-gray-700 space-y-1">
                <p className="font-medium text-gray-900">{order.shipping_address.full_name}</p>
                <p>{order.shipping_address.address}</p>
                {order.shipping_address.subdistrict && <p>{order.shipping_address.subdistrict}</p>}
                <p>
                  {order.shipping_address.district}, {order.shipping_address.province} {order.shipping_address.postal_code}
                </p>
                <p>{order.shipping_address.country}</p>
                <p className="text-gray-500 mt-2">
                  {tThankYou('orderDetails.phone', { defaultValue: 'Phone' })}: {order.shipping_address.phone}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                {tThankYou('shippingAddress.missing', { defaultValue: 'No shipping address available.' })}
              </p>
            )}
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('detail.orderNotes')}</h3>
              <p className="text-sm text-gray-700">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">{t('detail.orderTimeline')}</h3>
            </div>
            <div className="space-y-4">
              {order.delivered_at && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{t('detail.delivered')}</p>
                    <p className="text-xs text-gray-500">{formatDate(order.delivered_at, locale)}</p>
                  </div>
                </div>
              )}
              {order.shipped_at && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{t('detail.shipped')}</p>
                    <p className="text-xs text-gray-500">{formatDate(order.shipped_at, locale)}</p>
                  </div>
                </div>
              )}
              {order.paid_at && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{t('detail.paid')}</p>
                    <p className="text-xs text-gray-500">{formatDate(order.paid_at, locale)}</p>
                  </div>
                </div>
              )}
              {order.placed_at && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-gray-400 rounded-full mt-1.5"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{t('detail.orderPlaced')}</p>
                    <p className="text-xs text-gray-500">{formatDate(order.placed_at, locale)}</p>
                  </div>
                </div>
              )}
              {order.cancelled_at && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-1.5"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{t('detail.cancelled')}</p>
                    <p className="text-xs text-gray-500">{formatDate(order.cancelled_at, locale)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                {tThankYou('paymentInfo.title', { defaultValue: 'Payment Information' })}
              </h3>
            </div>
            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex justify-between">
                <span>{t('detail.status')}:</span>
                <span className="font-medium text-gray-900">{order.paid_at ? t('detail.paid') : t('detail.pending')}</span>
              </div>
              {order.paid_at && (
                <div className="flex justify-between">
                  <span>{t('detail.paidAt')}:</span>
                  <span className="font-medium text-gray-900">{formatDate(order.paid_at, locale)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('detail.actions')}</h3>
            {status === 'processing' && (
              <Button variant="outline" size="sm" fullWidth disabled>
                {t('orderCard.cancelOrder')}
              </Button>
            )}
            <Link href="/member/orders">
              <Button variant="outline" size="sm" fullWidth>
                {t('detail.backToAllOrders')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
