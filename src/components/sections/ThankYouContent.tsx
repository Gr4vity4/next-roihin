'use client'

import Container from '@/components/ui/Container'
import Typography from '@/components/ui/Typography'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { ChangeEvent, useEffect, useState } from 'react'
import { getOrder, uploadSlipBase64, getBankAccounts } from '@/lib/api/orders'
import type { Order, BankAccount } from '@/lib/types/order'

export default function ThankYouContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploadingSlip, setIsUploadingSlip] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [slipPreview, setSlipPreview] = useState<string>('')

  const orderId = searchParams.get('order')
  const orderKey = searchParams.get('key')

  useEffect(() => {
    const fetchOrderAndBanks = async () => {
      if (!orderId || !orderKey) {
        // Try to get from sessionStorage
        const lastOrder = sessionStorage.getItem('lastOrder')
        if (lastOrder) {
          const orderData = JSON.parse(lastOrder)
          router.replace(`/checkout/thank-you?order=${orderData.orderId}&key=${orderData.orderKey}`)
          return
        }
        router.push('/checkout')
        return
      }

      try {
        // Fetch order details
        const orderData = await getOrder(orderId, orderKey)
        if (orderData.ok) {
          setOrder(orderData.order)
        }

        // Fetch bank accounts
        const banksData = await getBankAccounts()
        if (banksData.ok) {
          setBankAccounts(banksData.accounts)
        }
      } catch (error) {
        console.error('Error fetching order:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrderAndBanks()
  }, [orderId, orderKey, router])

  const handleSlipUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !order) return

    setIsUploadingSlip(true)
    setUploadError('')
    setUploadSuccess(false)

    try {
      // Read file as base64 for preview
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64 = reader.result as string
        setSlipPreview(base64)

        // Upload slip
        try {
          const response = await uploadSlipBase64(
            order.order_id.toString(),
            order.order_key,
            base64
          )

          if (response.ok) {
            setUploadSuccess(true)
            setOrder(response.order)
            setTimeout(() => setUploadSuccess(false), 5000)
          }
        } catch (error) {
          setUploadError('เกิดข้อผิดพลาดในการอัปโหลดสลิป กรุณาลองใหม่')
          console.error('Upload error:', error)
        } finally {
          setIsUploadingSlip(false)
        }
      }
      reader.readAsDataURL(file)
    } catch {
      setUploadError('เกิดข้อผิดพลาดในการอ่านไฟล์')
      setIsUploadingSlip(false)
    }
  }

  if (isLoading) {
    return (
      <section className="pt-24 pb-12 md:pt-32 md:pb-16 min-h-screen bg-gray-50">
        <Container>
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">กำลังโหลดข้อมูลคำสั่งซื้อ...</p>
            </div>
          </div>
        </Container>
      </section>
    )
  }

  if (!order) {
    return (
      <section className="pt-24 pb-12 md:pt-32 md:pb-16 min-h-screen bg-gray-50">
        <Container>
          <div className="text-center">
            <p className="text-gray-600 mb-4">ไม่พบข้อมูลคำสั่งซื้อ</p>
            <Link href="/checkout" className="text-green-600 hover:text-green-700 underline">
              กลับไปหน้าตะกร้าสินค้า
            </Link>
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section className="pt-24 pb-12 md:pt-32 md:pb-16 min-h-screen bg-gray-50">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircleIcon className="w-8 h-8 text-green-600" />
            </div>
            <Typography variant="h3" className="text-gray-900 mb-2">
              ขอบคุณสำหรับการสั่งซื้อ!
            </Typography>
            <p className="text-gray-600">
              หมายเลขคำสั่งซื้อ: <span className="font-semibold">{order.order_number}</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              สถานะ: <span className="font-medium">{order.status_label}</span>
            </p>
          </div>

          {/* Order Details */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">รายละเอียดคำสั่งซื้อ</h3>
              
              <div className="space-y-3 pb-4 border-b border-gray-200">
                {order.items.map((item) => (
                  <div key={item.item_id} className="flex justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      {item.meta?.color && (
                        <p className="text-xs text-gray-500">สี: {item.meta.color}</p>
                      )}
                      <p className="text-xs text-gray-600">จำนวน: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      ฿{parseFloat(item.total).toLocaleString('th-TH')}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">ราคาสินค้า</span>
                  <span className="font-medium">฿{parseFloat(order.subtotal).toLocaleString('th-TH')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">ค่าจัดส่ง</span>
                  <span className="font-medium">
                    {parseFloat(order.shipping_total) > 0 
                      ? `฿${parseFloat(order.shipping_total).toLocaleString('th-TH')}`
                      : 'ฟรี'
                    }
                  </span>
                </div>
                <div className="flex justify-between text-base font-semibold pt-2 border-t">
                  <span>รวมทั้งหมด</span>
                  <span className="text-green-600">฿{parseFloat(order.total).toLocaleString('th-TH')}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">ที่อยู่จัดส่ง</h3>
              
              <div className="text-sm text-gray-700 space-y-1">
                <p className="font-medium">
                  {order.billing.first_name} {order.billing.last_name}
                </p>
                <p>{order.billing.phone}</p>
                <p>{order.billing.address_1}</p>
                {order.billing.address_2 && <p>{order.billing.address_2}</p>}
                <p>
                  {order.billing.city}, {order.billing.state} {order.billing.postcode}
                </p>
              </div>
            </div>
          </div>

          {/* Bank Accounts & Slip Upload */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">ข้อมูลการชำระเงิน</h3>
            
            {bankAccounts.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-sm font-medium text-gray-900 mb-3">โอนเงินไปที่บัญชีใดบัญชีหนึ่งด้านล่าง:</p>
                <div className="space-y-3">
                  {bankAccounts.map((account, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                      <p className="font-medium text-gray-900">{account.bank_name}</p>
                      <p className="text-sm text-gray-700">ชื่อบัญชี: {account.account_name}</p>
                      <p className="text-sm text-gray-700">เลขบัญชี: {account.account_number}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Slip Upload Section */}
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3">
                {order.slip ? 'อัปเดตสลิปการโอนเงิน' : 'แนบสลิปการโอนเงิน'}
              </h4>

              {order.slip && (
                <div className="mb-4">
                  <p className="text-sm text-green-600 mb-2">✓ คุณได้แนบสลิปแล้ว</p>
                  <div className="relative w-48 h-64 border border-gray-200 rounded-lg overflow-hidden">
                    <Image
                      src={order.slip}
                      alt="Payment slip"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <label className="block">
                  <span className="sr-only">เลือกไฟล์สลิป</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSlipUpload}
                    disabled={isUploadingSlip}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-lg file:border-0
                      file:text-sm file:font-semibold
                      file:bg-green-50 file:text-green-700
                      hover:file:bg-green-100
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </label>

                {slipPreview && !order.slip && (
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

                {isUploadingSlip && (
                  <p className="text-sm text-gray-600">กำลังอัปโหลด...</p>
                )}

                {uploadSuccess && (
                  <p className="text-sm text-green-600">✓ อัปโหลดสลิปสำเร็จ</p>
                )}

                {uploadError && (
                  <p className="text-sm text-red-500">{uploadError}</p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              กลับหน้าหลัก
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}