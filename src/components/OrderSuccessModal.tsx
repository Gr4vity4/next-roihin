'use client'

import Modal from '@/components/ui/Modal'
import { CircleCheck, Mail, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useLocale } from 'next-intl'

interface OrderSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  orderId: string
  orderKey: string
  orderNumber?: string
  total?: number
}

export default function OrderSuccessModal({
  isOpen,
  onClose,
  orderId,
  orderKey,
  orderNumber,
  total,
}: OrderSuccessModalProps) {
  const router = useRouter()
  const locale = useLocale()
  const isThai = locale === 'th'
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    if (!isOpen) {
      // Reset countdown when modal closes
      setCountdown(5)
      return
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          // Redirect to member page after countdown
          router.push('/member')
          onClose()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen, router, onClose])

  const handleViewOrder = () => {
    onClose()
    router.push(`/checkout/thank-you?order=${orderId}&key=${orderKey}`)
  }

  const handleGoToMember = () => {
    onClose()
    router.push('/member')
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      showCloseButton={false}
      closeOnOverlayClick={false}
    >
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
          <CircleCheck
            className="h-10 w-10 text-green-600"
            aria-hidden="true"
            fill="currentColor"
          />
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {isThai ? 'สั่งซื้อสำเร็จ!' : 'Order placed successfully!'}
        </h3>

        <p className="text-gray-600 mb-6">
          {isThai ? 'ขอบคุณสำหรับการสั่งซื้อของคุณ' : 'Thank you for your order.'}
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          {orderNumber && (
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-medium">
                {isThai ? 'หมายเลขคำสั่งซื้อ:' : 'Order number:'}
              </span>{' '}
              #{orderNumber}
            </p>
          )}
          {total && (
            <p className="text-sm text-gray-700">
              <span className="font-medium">{isThai ? 'ยอดรวม:' : 'Total:'}</span>{' '}
              ฿{total.toLocaleString(isThai ? 'th-TH' : 'en-US')}
            </p>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <span className="font-medium inline-flex items-center gap-1">
              <Mail className="w-4 h-4 inline" /> {isThai ? 'อีเมลยืนยัน:' : 'Confirmation email:'}
            </span>{' '}
            {isThai
              ? 'เราได้ส่งรายละเอียดคำสั่งซื้อไปยังอีเมลของคุณแล้ว'
              : 'We have sent your order details to your email.'}
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-amber-800">
            <span className="font-medium inline-flex items-center gap-1">
              <Clock className="w-4 h-4 inline" /> {isThai ? 'การดำเนินการ:' : 'Processing:'}
            </span>{' '}
            {isThai
              ? 'ทีมงานจะตรวจสอบการชำระเงินและจัดส่งสินค้าภายใน 1-2 วันทำการ'
              : 'Our team will verify payment and ship your order within 1-2 business days.'}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 mb-6 text-center">
          <p className="text-sm text-gray-600">
            {isThai ? 'กำลังนำคุณไปยังหน้าสมาชิกใน ' : 'Redirecting you to member page in '}
            <span className="font-bold text-green-600">{countdown}</span>{' '}
            {isThai ? 'วินาที...' : 'seconds...'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            className="flex-1 px-6 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-[#244323] transition-colors"
            onClick={handleGoToMember}
          >
            {isThai ? 'ไปยังหน้าสมาชิก' : 'Go to member page'}
          </button>
          <button
            type="button"
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition-colors"
            onClick={handleViewOrder}
          >
            {isThai ? 'ดูรายละเอียดคำสั่งซื้อ' : 'View order details'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
