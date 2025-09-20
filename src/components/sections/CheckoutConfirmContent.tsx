'use client'

import Container from '@/components/ui/Container'
import Typography from '@/components/ui/Typography'
import { useCart } from '@/contexts/CartContext'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { getBanks } from '@/lib/api/banks'
import type { BankData } from '@/lib/types/bank'
import { createOrder, uploadSlipBase64, getBankAccounts } from '@/lib/api/orders.client'
import type { OrderCreateRequest, BankAccount } from '@/lib/types/order'
import { getDefaultAddress } from '@/lib/api/addresses.client'
import { useAuth } from '@/contexts/AuthContext'
import { useLocale } from 'next-intl'
import OrderSuccessModal from '@/components/OrderSuccessModal'

interface ShippingAddress {
  fullName: string
  email: string
  phone: string
  address: string
  district: string
  province: string
  postalCode: string
}

export default function CheckoutConfirmContent() {
  const router = useRouter()
  const { items, itemCount, totalAmount, clearCart } = useCart()
  const { isLoggedIn, user } = useAuth()
  const locale = useLocale() as 'en' | 'th'
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSlip, setPaymentSlip] = useState<File | null>(null)
  const [slipPreview, setSlipPreview] = useState<string>('')
  const [banks, setBanks] = useState<BankData[]>([])
  const [selectedBank, setSelectedBank] = useState<string>('')
  const [, setBankAccounts] = useState<BankAccount[]>([])
  const [orderError, setOrderError] = useState<string>('')
  const [addressLoading, setAddressLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [orderDetails, setOrderDetails] = useState<{
    orderId: string
    orderKey: string
    orderNumber?: string
    total?: number
  } | null>(null)
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    district: '',
    province: '',
    postalCode: '',
  })

  useEffect(() => {
    // Only redirect if cart is empty AND we don't have a successful order
    if (itemCount === 0 && !orderSuccess) {
      router.push('/checkout')
    }
  }, [itemCount, router, orderSuccess])

  useEffect(() => {
    const fetchDefaultAddress = async () => {
      if (!isLoggedIn) return
      
      setAddressLoading(true)
      try {
        const { hasDefault, item } = await getDefaultAddress()
        
        if (hasDefault && item) {
          setShippingAddress({
            fullName: item.full_name,
            email: user?.email || '',
            phone: item.phone,
            address: `${item.address}${item.subdistrict ? `, ${item.subdistrict}` : ''}`,
            district: item.district,
            province: item.province,
            postalCode: item.postal_code,
          })
        }
      } catch (error) {
        console.error('Failed to fetch default address:', error)
      } finally {
        setAddressLoading(false)
      }
    }

    fetchDefaultAddress()
  }, [isLoggedIn, user])

  useEffect(() => {
    const fetchBanks = async () => {
      // Fetch banks from existing API for display
      const banksData = await getBanks(locale)
      setBanks(banksData)
      if (banksData.length > 0) {
        setSelectedBank(banksData[0].acf.bank_account_number)
      }

      // Also fetch bank accounts from the new REST API
      try {
        const bankAccountsResponse = await getBankAccounts()
        if (bankAccountsResponse.ok) {
          setBankAccounts(bankAccountsResponse.accounts)
        }
      } catch (error) {
        console.error('Error fetching bank accounts:', error)
      }
    }
    fetchBanks()
  }, [locale])

  const handleAddressChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
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
    setOrderError('')

    try {
      // Split full name into first and last name
      const nameParts = shippingAddress.fullName.trim().split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || nameParts[0] || ''

      // Prepare order data
      const orderData: OrderCreateRequest = {
        items: items.map(item => ({
          product_id: parseInt(item.id),
          quantity: item.quantity,
          color: item.color || undefined,
          price: item.price,
          total: item.price * item.quantity,
        })),
        billing: {
          first_name: firstName,
          last_name: lastName,
          email: shippingAddress.email || `${shippingAddress.phone}@roihin.temp`, // Use actual email or fallback to temporary
          phone: shippingAddress.phone,
          address_1: shippingAddress.address,
          address_2: '',
          city: shippingAddress.district,
          state: shippingAddress.province,
          postcode: shippingAddress.postalCode,
          country: 'TH',
        },
        payment_method: 'bacs',
        shipping_total: 0,
        total: totalAmount,
        subtotal: totalAmount,
        note: '',
        slip_base64: slipPreview || undefined, // Include slip if available
      }

      // Create order
      const orderResponse = await createOrder(orderData)

      console.log('Order response:', orderResponse) // Debug log

      if (!orderResponse.ok) {
        throw new Error('Failed to create order')
      }

      // If slip wasn't included in creation and we have one, upload it separately
      if (!slipPreview && paymentSlip && orderResponse.order) {
        try {
          await uploadSlipBase64(
            orderResponse.order.order_id.toString(),
            orderResponse.order.order_key,
            slipPreview
          )
        } catch (uploadError) {
          console.error('Failed to upload slip:', uploadError)
          // Continue anyway since order was created
        }
      }

      // Store order info in sessionStorage for thank you page
      // Use the total from the response, or fallback to our calculated total
      const orderTotal = orderResponse.order.total ? parseFloat(orderResponse.order.total) : totalAmount
      
      const orderInfo = {
        orderId: orderResponse.order.order_id.toString(),
        orderKey: orderResponse.order.order_key,
        orderNumber: orderResponse.order.order_number,
        total: orderTotal || totalAmount, // Always fallback to totalAmount if orderTotal is 0 or NaN
      }
      
      sessionStorage.setItem('lastOrder', JSON.stringify(orderInfo))

      // Set order success flag BEFORE clearing cart
      setOrderSuccess(true)
      
      // Set order details and show success modal
      setOrderDetails(orderInfo)
      setShowSuccessModal(true)
      
      // Clear cart after setting success flag
      clearCart()
      
      setIsProcessing(false)

    } catch (error) {
      console.error('Order creation failed:', error)
      setOrderError('เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ กรุณาลองใหม่อีกครั้ง')
      setIsProcessing(false)
    }
  }

  const isFormValid = () => {
    return (
      shippingAddress.fullName &&
      shippingAddress.email &&
      shippingAddress.phone &&
      shippingAddress.address &&
      shippingAddress.district &&
      shippingAddress.province &&
      shippingAddress.postalCode &&
      selectedBank &&
      paymentSlip
    )
  }

  if (itemCount === 0 && !orderSuccess) {
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
            <Typography variant="h3" className="text-gray-900">
              ยืนยันการสั่งซื้อ
            </Typography>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Shipping Address */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">ที่อยู่จัดส่ง</h3>
                    {addressLoading && (
                      <span className="text-sm text-gray-500">กำลังโหลดที่อยู่...</span>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label
                        htmlFor="fullName"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
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
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        อีเมล *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={shippingAddress.email}
                        onChange={handleAddressChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
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
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
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
                      <label
                        htmlFor="district"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
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
                      <label
                        htmlFor="province"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
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
                      <label
                        htmlFor="postalCode"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
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
                      <p className="text-sm text-gray-600">กรุณาเลือกบัญชีธนาคารที่ต้องการโอนเงิน</p>
                    </div>

                    {/* Bank Selection */}
                    {banks.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-gray-700">เลือกบัญชีธนาคาร *</p>
                        {banks.map((bank) => (
                          <label
                            key={bank.acf.bank_account_number}
                            className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                              selectedBank === bank.acf.bank_account_number
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="bank"
                              value={bank.acf.bank_account_number}
                              checked={selectedBank === bank.acf.bank_account_number}
                              onChange={(e) => setSelectedBank(e.target.value)}
                              className="mt-1 w-4 h-4 text-green-600 focus:ring-green-500"
                            />
                            <div className="flex items-start gap-3 flex-1">
                              {bank.acf.bank_image && (
                                <div className="relative w-12 h-12 flex-shrink-0">
                                  <Image
                                    src={bank.acf.bank_image}
                                    alt={bank.acf.bank_name}
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                              )}
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{bank.acf.bank_name}</p>
                                <p className="text-sm text-gray-600">{bank.acf.bank_branch_name}</p>
                                <p className="text-sm text-gray-700 font-medium mt-1">
                                  ชื่อบัญชี: {bank.acf.bank_account_name}
                                </p>
                                <p className="text-sm text-gray-700">
                                  เลขบัญชี: {bank.acf.bank_account_number}
                                </p>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}

                    <div>
                      <label
                        htmlFor="paymentSlip"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
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
                          {item.color && <p className="text-xs text-gray-500">สี: {item.color}</p>}
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
                      กรุณากรอกข้อมูล เลือกบัญชีธนาคาร และแนบสลิปให้ครบถ้วน
                    </p>
                  )}

                  {orderError && (
                    <p className="text-sm text-red-500 mt-2 text-center">
                      {orderError}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </Container>

      {/* Order Success Modal */}
      {orderDetails && (
        <OrderSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          orderId={orderDetails.orderId}
          orderKey={orderDetails.orderKey}
          orderNumber={orderDetails.orderNumber}
          total={orderDetails.total}
        />
      )}
    </section>
  )
}
