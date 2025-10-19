'use client'

import { useEffect, useMemo, useState } from 'react'
import { Link } from '@/i18n/navigation'
import Button from '@/components/Button'
import { useLocale, useTranslations } from 'next-intl'
import type { OrderResource, OrderStatus } from '@/lib/types/order'

type FilterStatus = 'all' | OrderStatus

interface OrdersResponseBody {
  data?: OrderResource[]
  error?: string
}

const STATUS_TABS: FilterStatus[] = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled']

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

export default function OrdersPage() {
  const t = useTranslations('member.orders')
  const locale = useLocale()

  const [orders, setOrders] = useState<OrderResource[]>([])
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadOrders() {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/orders', { cache: 'no-store' })

        if (response.status === 401) {
          if (!isMounted) return
          setOrders([])
          setError('unauthorized')
          return
        }

        const body: OrdersResponseBody = await response.json()

        if (!response.ok) {
          throw new Error(body?.error || 'FAILED')
        }

        if (!isMounted) return
        setOrders(body?.data ?? [])
      } catch (err) {
        if (!isMounted) return
        setError(err instanceof Error ? err.message : 'unknown')
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadOrders()

    return () => {
      isMounted = false
    }
  }, [])

  const filteredOrders = useMemo(() => {
    if (filterStatus === 'all') {
      return orders
    }

    return orders.filter(order => order.status?.toLowerCase() === filterStatus)
  }, [filterStatus, orders])

  const renderStatusTabLabel = (tab: FilterStatus) => {
    if (tab === 'all') {
      return t('tabs.all')
    }

    const key = tab.toLowerCase()
    try {
      return t(`tabs.${key}`)
    } catch {
      return tab
    }
  }

  const renderStatusChip = (status: string, fallback?: string | null) => {
    const normalized = status?.toLowerCase?.() ?? ''
    try {
      return t(`tabs.${normalized}`)
    } catch {
      return fallback ?? status ?? '—'
    }
  }

  const renderBody = () => {
    if (loading) {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center text-gray-500">
          {t('loading')}
        </div>
      )
    }

    if (error) {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-red-100 p-10 text-center">
          <p className="text-red-600 font-medium">
            {t(error === 'unauthorized' ? 'errors.unauthorized' : 'errors.loadFailed')}
          </p>
        </div>
      )
    }

    if (filteredOrders.length === 0) {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('empty.title')}</h3>
          <p className="text-gray-500 mb-6">{t('empty.subtitle')}</p>
          <Link href="/custom">
            <Button>{t('empty.startShopping')}</Button>
          </Link>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {filteredOrders.map(order => {
          const status = order.status?.toLowerCase?.() ?? ''
          const itemsCount = order.items?.length ?? 0
          const trackingNumber = order.tracking_number
          const totalFormatted = formatCurrency(order.total_amount_minor, order.currency, locale)
          const orderDate = formatOrderDate(order.placed_at, locale)

          return (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center flex-wrap gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{order.order_number}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusPillColor(status)}`}>
                      {renderStatusChip(status, order.status_label)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{t('orderCard.orderedOn', { date: orderDate })}</p>
                </div>
                <p className="text-xl font-bold text-gray-900">{totalFormatted}</p>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      {t('orderCard.items', { count: itemsCount })}
                    </p>
                    {trackingNumber && (
                      <p className="text-sm text-gray-600">
                        {t('orderCard.tracking', { number: trackingNumber })}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/member/orders/${order.id}`}>
                      <Button variant="outline" size="sm">
                        {t('orderCard.viewDetails')}
                      </Button>
                    </Link>
                    {status === 'processing' && (
                      <Button variant="outline" size="sm" disabled>
                        {t('orderCard.cancelOrder')}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto pt-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
        <p className="text-gray-600">{t('subtitle')}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="flex overflow-x-auto p-1">
          {STATUS_TABS.map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`flex-1 min-w-[100px] px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-[#005635] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {renderStatusTabLabel(status)}
            </button>
          ))}
        </div>
      </div>

      {renderBody()}
    </div>
  )
}
