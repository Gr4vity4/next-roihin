'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Link } from '@/i18n/navigation'
import type { OrderResource } from '@/lib/types/order'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'

const MAX_RECENT_ORDERS = 3

interface OrdersResponseBody {
  data?: OrderResource[]
  error?: string
}

function formatCurrency(amountMinor: number, currency: string, locale: string): string {
  const resolvedLocale = locale === 'th' ? 'th-TH' : 'en-US'
  try {
    return new Intl.NumberFormat(resolvedLocale, {
      style: 'currency',
      currency: currency || 'THB',
    }).format((amountMinor ?? 0) / 100)
  } catch {
    return `${currency ?? 'THB'} ${((amountMinor ?? 0) / 100).toFixed(2)}`
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

function getStatusBadgeColor(status: string): string {
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

export default function MemberDashboard() {
  const locale = useLocale()
  const t = useTranslations('member.dashboard')
  const tOrders = useTranslations('member.orders')
  const { user } = useAuth()

  const [orders, setOrders] = useState<OrderResource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadOrders() {
      if (!user) {
        if (isMounted) {
          setOrders([])
          setLoading(false)
          setError(null)
        }
        return
      }

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

    void loadOrders()

    return () => {
      isMounted = false
    }
  }, [user])

  const recentOrders = useMemo(() => orders.slice(0, MAX_RECENT_ORDERS), [orders])

  const renderStatusLabel = (status: string, fallback?: string | null) => {
    const normalized = status?.toLowerCase?.()
    if (!normalized) {
      return fallback ?? '—'
    }

    try {
      const translated = t(`recentOrders.statuses.${normalized}`)
      if (translated && !translated.includes(`recentOrders.statuses.${normalized}`)) {
        return translated
      }
    } catch {
      // ignore missing translation - we will fallback below
    }

    return fallback ?? status ?? normalized
  }

  const renderTableBody = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={4} className="py-6 px-4 text-center text-sm text-gray-500">
            {tOrders('loading')}
          </td>
        </tr>
      )
    }

    if (error) {
      return (
        <tr>
          <td colSpan={4} className="py-6 px-4 text-center text-sm text-red-600">
            {error === 'unauthorized' ? tOrders('errors.unauthorized') : tOrders('errors.loadFailed')}
          </td>
        </tr>
      )
    }

    if (recentOrders.length === 0) {
      return (
        <tr>
          <td colSpan={4} className="py-6 px-4 text-center text-sm text-gray-500">
            {tOrders('empty.title')}
          </td>
        </tr>
      )
    }

    return recentOrders.map((order) => {
      const status = order.status?.toLowerCase?.() ?? ''
      const statusLabel = renderStatusLabel(status, order.status_label)
      const orderDate = formatOrderDate(order.placed_at, locale)
      const totalFormatted = formatCurrency(order.total_amount_minor, order.currency, locale)

      return (
        <tr key={order.id} className="border-b border-gray-100">
          <td className="py-3 px-4 text-sm font-medium text-gray-900">{order.order_number}</td>
          <td className="py-3 px-4 text-sm text-gray-600">{orderDate}</td>
          <td className="py-3 px-4">
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(status)}`}>
              {statusLabel}
            </span>
          </td>
          <td className="py-3 px-4 text-sm text-gray-900 text-right">{totalFormatted}</td>
        </tr>
      )
    })
  }

  return (
    <>
      {/* Header */}
      {/* <div className="mb-8 mt-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {(() => {
            if (user?.name) {
              const titleWithName = t('titleWithName', { name: user.name })
              // Fallback if translation doesn't work properly
              if (titleWithName.includes('titleWithName')) {
                return `Welcome back, ${user.name}!`
              }
              return titleWithName
            }
            return t('title')
          })()}
        </h1>
        <p className="text-gray-600">{t('subtitle')}</p>
      </div> */}

      {/* Recent Orders */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">{t('recentOrders.title')}</h2>
          <Link href="/member/orders" className="text-[#244323] hover:underline text-sm">
            {t('recentOrders.viewAll')}
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">{t('recentOrders.columns.orderId')}</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">{t('recentOrders.columns.date')}</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">{t('recentOrders.columns.status')}</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">{t('recentOrders.columns.total')}</th>
              </tr>
            </thead>
            <tbody>{renderTableBody()}</tbody>
          </table>
        </div>
      </div>
    </>
  )
}
