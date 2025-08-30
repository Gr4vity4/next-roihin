'use client'

import Container from '@/components/ui/Container'
import Typography from '@/components/ui/Typography'
import { useCart } from '@/contexts/CartContext'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState, ChangeEvent, FormEvent } from 'react'

interface ShippingAddress {
  fullName: string
  phone: string
  address: string
  district: string
  province: string
  postalCode: string
}

export default function CheckoutConfirmContent() {
  const router = useRouter()
  const { items, itemCount, totalAmount, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSlip, setPaymentSlip] = useState<File | null>(null)
  const [slipPreview, setSlipPreview] = useState<string>('')
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: '',
    phone: '',
    address: '',
    district: '',
    province: '',
    postalCode: '',
  })

  useEffect(() => {
    if (itemCount === 0) {
      router.push('/checkout')
    }
  }, [itemCount, router])

  const handleAddressChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPaymentSlip(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setSlipPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    const orderSummary = items
      .map(
        (item) =>
          `- ${item.title} ${item.color ? `(${item.color})` : ''} x ${item.quantity} = ฿${(
            item.price * item.quantity
          ).toLocaleString('th-TH')}`,
      )
      .join('\n')

    const addressText = `
ชื่อ-นามสกุล: ${shippingAddress.fullName}
เบอร์โทร: ${shippingAddress.phone}
ที่อยู่: ${shippingAddress.address}
อำเภอ/เขต: ${shippingAddress.district}
จังหวัด: ${shippingAddress.province}
รหัสไปรษณีย์: ${shippingAddress.postalCode}
    `.trim()

    const message = encodeURIComponent(
      `สั่งซื้อสินค้า:\n${orderSummary}\n\nรวมทั้งหมด: ฿${totalAmount.toLocaleString('th-TH')}\n\nที่อยู่จัดส่ง:\n${addressText}\n\n${paymentSlip ? 'ได้แนบสลิปการโอนเงินแล้ว' : 'ยังไม่ได้แนบสลิป'}`,
    )

    clearCart()

    window.open(`https://lin.ee/xyzabc?message=${message}`, '_blank')

    setTimeout(() => {
      router.push('/')
      setIsProcessing(false)
    }, 1000)
  }

  const isFormValid = () => {
    return (
      shippingAddress.fullName &&
      shippingAddress.phone &&
      shippingAddress.address &&
      shippingAddress.district &&
      shippingAddress.province &&
      shippingAddress.postalCode &&
      paymentSlip
    )
  }

  if (itemCount === 0) {
    return null
  }

  return (
    <section className="pt-24 pb-12 md:pt-32 md:pb-16 min-h-screen bg-gray-50">
      <Container>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/checkout"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Back to cart"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
            </Link>
            <Typography variant="h2" className="text-gray-900">
              ยืนยันการสั่งซื้อ
            </Typography>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Shipping Address */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">ที่อยู่จัดส่ง</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                        ชื่อ-นามสกุล *
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={shippingAddress.fullName}
                        onChange={handleAddressChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        เบอร์โทรศัพท์ *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={shippingAddress.phone}
                        onChange={handleAddressChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                        ที่อยู่ *
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        value={shippingAddress.address}
                        onChange={handleAddressChange}
                        required
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-2">
                        อำเภอ/เขต *
                      </label>
                      <input
                        type="text"
                        id="district"
                        name="district"
                        value={shippingAddress.district}
                        onChange={handleAddressChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-2">
                        จังหวัด *
                      </label>
                      <input
                        type="text"
                        id="province"
                        name="province"
                        value={shippingAddress.province}
                        onChange={handleAddressChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                        รหัสไปรษณีย์ *
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={shippingAddress.postalCode}
                        onChange={handleAddressChange}
                        required
                        maxLength={5}
                        pattern="[0-9]{5}"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">วิธีการชำระเงิน</h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border-2 border-green-500 rounded-lg">
                      <p className="font-medium text-gray-900 mb-2">โอนเงินผ่านธนาคาร</p>
                      <p className="text-sm text-gray-600">กรุณาโอนเงินและแนบสลิปการโอนเงิน</p>
                    </div>

                    <div>
                      <label htmlFor="paymentSlip" className="block text-sm font-medium text-gray-700 mb-2">
                        แนบสลิปการโอนเงิน *
                      </label>
                      <input
                        type="file"
                        id="paymentSlip"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      
                      {slipPreview && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-600 mb-2">ตัวอย่างสลิป:</p>
                          <div className="relative w-48 h-64 border border-gray-200 rounded-lg overflow-hidden">
                            <Image 
                              src={slipPreview} 
                              alt="Payment slip preview" 
                              fill 
                              className="object-contain"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                  <h2 className="text-xl text-gray-900 font-semibold mb-6">สรุปคำสั่งซื้อ</h2>

                  {/* Order Items */}
                  <div className="space-y-3 pb-4 mb-4 border-b border-gray-200 max-h-64 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                          <Image src={item.image} alt={item.title} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                          {item.color && (
                            <p className="text-xs text-gray-500">สี: {item.color}</p>
                          )}
                          <p className="text-xs text-gray-600">
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
                      <span>ราคาสินค้า ({itemCount} ชิ้น)</span>
                      <span className="font-medium text-gray-900">
                        ฿{totalAmount.toLocaleString('th-TH')}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>ค่าจัดส่ง</span>
                      <span className="text-green-600 font-medium">ฟรี</span>
                    </div>
                  </div>

                  <div className="pt-4 pb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-900 text-lg font-semibold">รวมทั้งหมด</span>
                      <span className="text-2xl font-bold text-gray-900">
                        ฿{totalAmount.toLocaleString('th-TH')}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing || !isFormValid()}
                    className={`w-full px-6 py-4 font-medium rounded-lg transition-all transform hover:scale-105 shadow-lg ${
                      isProcessing || !isFormValid()
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {isProcessing ? 'กำลังดำเนินการ...' : 'ยืนยันการสั่งซื้อ'}
                  </button>

                  {!isFormValid() && (
                    <p className="text-xs text-red-500 mt-2 text-center">
                      กรุณากรอกข้อมูลและแนบสลิปให้ครบถ้วน
                    </p>
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