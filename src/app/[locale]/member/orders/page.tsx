'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import Button from '@/components/Button'
import { useTranslations } from 'next-intl'

type OrderStatus = 'All' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'

interface Order {
  id: string
  date: string
  status: string
  items: number
  total: string
  trackingNumber?: string
}

export default function OrdersPage() {
  const t = useTranslations('member.orders')
  const [filterStatus, setFilterStatus] = useState<OrderStatus>('All')

  const orders: Order[] = [
    { id: 'ORD-001', date: '2024-01-15', status: 'Delivered', items: 2, total: '฿3,500', trackingNumber: 'TH123456789' },
    { id: 'ORD-002', date: '2024-01-20', status: 'Processing', items: 1, total: '฿2,800' },
    { id: 'ORD-003', date: '2024-01-25', status: 'Shipped', items: 3, total: '฿4,200', trackingNumber: 'TH987654321' },
    { id: 'ORD-004', date: '2024-01-10', status: 'Delivered', items: 1, total: '฿1,500', trackingNumber: 'TH456789123' },
    { id: 'ORD-005', date: '2024-01-05', status: 'Cancelled', items: 2, total: '฿2,100' },
  ]

  const filteredOrders = filterStatus === 'All'
    ? orders
    : orders.filter(order => order.status === filterStatus)

  const statusTabs: OrderStatus[] = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Delivered': return 'bg-green-100 text-green-800'
      case 'Processing': return 'bg-yellow-100 text-yellow-800'
      case 'Shipped': return 'bg-blue-100 text-blue-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusTranslation = (status: string) => {
    const statusKey = status.toLowerCase() as 'delivered' | 'processing' | 'shipped' | 'cancelled'
    return t(`tabs.${statusKey}`)
  }

  const getTabTranslation = (tab: string) => {
    const tabKey = tab.toLowerCase() as 'all' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
    return t(`tabs.${tabKey}`)
  }

  return (
    <div className="max-w-7xl mx-auto pt-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
        <p className="text-gray-600">{t('subtitle')}</p>
      </div>

      {/* Status Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="flex overflow-x-auto p-1">
          {statusTabs.map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`flex-1 min-w-[100px] px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-[#005635] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {getTabTranslation(status)}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{order.id}</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {getStatusTranslation(order.status)}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{t('orderCard.orderedOn', { date: order.date })}</p>
              </div>
              <p className="text-xl font-bold text-gray-900">{order.total}</p>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">
                    {t('orderCard.items', { count: order.items })}
                  </p>
                  {order.trackingNumber && (
                    <p className="text-sm text-gray-600">
                      {t('orderCard.tracking', { number: order.trackingNumber })}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    {t('orderCard.viewDetails')}
                  </Button>
                  {order.status === 'Delivered' && (
                    <Button variant="outline" size="sm">
                      {t('orderCard.writeReview')}
                    </Button>
                  )}
                  {order.status === 'Processing' && (
                    <Button variant="outline" size="sm">
                      {t('orderCard.cancelOrder')}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
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
      )}
    </div>
  )
}