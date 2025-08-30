'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Container from '@/components/ui/Container'
import Typography from '@/components/ui/Typography'
import { useCart } from '@/contexts/CartContext'
import { TrashIcon, MinusIcon, PlusIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'

export default function CheckoutContent() {
  const router = useRouter()
  const { items, itemCount, totalAmount, removeItem, updateQuantity, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Set loading to false after component mounts (client-side)
    setIsLoading(false)
  }, [])

  const handleCheckout = async () => {
    setIsProcessing(true)
    
    // Create order summary for LINE message
    const orderSummary = items.map(item => 
      `- ${item.title} ${item.color ? `(${item.color})` : ''} x ${item.quantity} = ฿${(item.price * item.quantity).toLocaleString('th-TH')}`
    ).join('\n')
    
    const message = encodeURIComponent(
      `สั่งซื้อสินค้า:\n${orderSummary}\n\nรวมทั้งหมด: ฿${totalAmount.toLocaleString('th-TH')}`
    )
    
    // Clear cart after processing
    clearCart()
    
    // Redirect to LINE with order details
    window.open(`https://lin.ee/xyzabc?message=${message}`, '_blank')
    
    // Redirect to thank you page
    setTimeout(() => {
      router.push('/')
      setIsProcessing(false)
    }, 1000)
  }

  if (isLoading) {
    return (
      <section className="pt-24 pb-12 md:pt-32 md:pb-16 min-h-screen bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto text-center py-16">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-48 mx-auto"></div>
            </div>
          </div>
        </Container>
      </section>
    )
  }

  if (itemCount === 0) {
    return (
      <section className="pt-24 pb-12 md:pt-32 md:pb-16 min-h-screen bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-12">
              <ShoppingBagIcon className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <Typography variant="h2" className="text-gray-900 mb-4">
                ตะกร้าสินค้าว่างเปล่า
              </Typography>
              <p className="text-gray-600 mb-8 text-lg">
                คุณยังไม่มีสินค้าในตะกร้า กรุณาเลือกสินค้าก่อน
              </p>
              <Link
                href="/charmspacer"
                className="inline-flex items-center justify-center px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-lg"
              >
                เลือกซื้อสินค้า
              </Link>
            </div>
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section className="pt-24 pb-12 md:pt-32 md:pb-16 min-h-screen bg-gray-50">
      <Container>
        <div className="max-w-7xl mx-auto">
          <Typography variant="h2" className="text-gray-900 mb-8">
            ตะกร้าสินค้า ({itemCount} ชิ้น)
          </Typography>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="relative w-28 h-28 md:w-36 md:h-36 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-4 mb-3">
                        <div>
                          <h3 className="text-gray-900 font-semibold text-lg md:text-xl">
                            {item.title}
                          </h3>
                          {item.color && (
                            <p className="text-gray-600 text-sm mt-1">สี: {item.color}</p>
                          )}
                          {item.category && (
                            <p className="text-gray-500 text-xs mt-1">หมวดหมู่: {item.category}</p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-2 h-fit"
                          aria-label="Remove item"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <MinusIcon className="w-4 h-4" />
                          </button>
                          <span className="text-gray-900 font-medium w-12 text-center text-lg">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors"
                            aria-label="Increase quantity"
                          >
                            <PlusIcon className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-900 font-semibold text-xl">
                            ฿{(item.price * item.quantity).toLocaleString('th-TH')}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-gray-500 text-sm mt-1">
                              ฿{item.price.toLocaleString('th-TH')} ต่อชิ้น
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center pt-4">
                <Link
                  href="/charmspacer"
                  className="text-green-600 hover:text-green-700 font-medium transition-colors"
                >
                  ← เลือกซื้อสินค้าเพิ่ม
                </Link>
                <button
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-600 text-sm font-medium transition-colors"
                >
                  ล้างตะกร้าสินค้า
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <h2 className="text-xl text-gray-900 font-semibold mb-6">
                  สรุปคำสั่งซื้อ
                </h2>

                <div className="space-y-4 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-gray-600">
                    <span>ราคาสินค้า ({itemCount} ชิ้น)</span>
                    <span className="font-medium text-gray-900">฿{totalAmount.toLocaleString('th-TH')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>ค่าจัดส่ง</span>
                    <span className="text-green-600 font-medium">ฟรี</span>
                  </div>
                </div>

                <div className="pt-6 pb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900 text-lg font-semibold">รวมทั้งหมด</span>
                    <span className="text-2xl font-bold text-gray-900">฿{totalAmount.toLocaleString('th-TH')}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className={`w-full px-6 py-4 font-medium rounded-lg transition-all transform hover:scale-105 shadow-lg ${
                    isProcessing
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {isProcessing ? 'กำลังดำเนินการ...' : 'ดำเนินการสั่งซื้อผ่าน LINE'}
                </button>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 text-center">
                    <span className="font-medium text-gray-700">📱 ติดต่อผ่าน LINE</span><br />
                    เราจะติดต่อกลับเพื่อยืนยันคำสั่งซื้อ<br />
                    และนัดหมายการจัดส่ง
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      จัดส่งฟรีทั่วประเทศ
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      รับประกันสินค้า 30 วัน
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      ชำระเงินปลายทาง
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}