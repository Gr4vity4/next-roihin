import Link from 'next/link'

export default function MemberDashboard() {
  const stats = [
    { label: 'Total Orders', value: '12', icon: '📦' },
    { label: 'In Progress', value: '2', icon: '⏳' },
    { label: 'Wishlist Items', value: '5', icon: '❤️' },
    { label: 'Total Spent', value: '฿15,420', icon: '💰' },
  ]

  const recentOrders = [
    { id: 'ORD-001', date: '2024-01-15', status: 'Delivered', total: '฿3,500' },
    { id: 'ORD-002', date: '2024-01-20', status: 'Processing', total: '฿2,800' },
    { id: 'ORD-003', date: '2024-01-25', status: 'Shipped', total: '฿4,200' },
  ]

  return (
    <>
          {/* Header */}
          <div className="mb-8 mt-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, John!</h1>
            <p className="text-gray-600">Here&apos;s what&apos;s happening with your orders today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl">{stat.icon}</span>
                  <span className="text-sm text-gray-500">{stat.label}</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
              <Link href="/member/orders" className="text-[#005635] hover:underline text-sm">
                View all →
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Order ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{order.id}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{order.date}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 text-right">{order.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
    </>
  )
}