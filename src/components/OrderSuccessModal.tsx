'use client'

import Modal from '@/components/ui/Modal'
import { CircleCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

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

        <h3 className="text-xl font-semibold text-gray-900 mb-2">สั่งซื้อสำเร็จ!</h3>

        <p className="text-gray-600 mb-6">ขอบคุณสำหรับการสั่งซื้อของคุณ</p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          {orderNumber && (
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-medium">หมายเลขคำสั่งซื้อ:</span> #{orderNumber}
            </p>
          )}
          {total && (
            <p className="text-sm text-gray-700">
              <span className="font-medium">ยอดรวม:</span> ฿{total.toLocaleString('th-TH')}
            </p>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <span className="font-medium">📧 อีเมลยืนยัน:</span>{' '}
            เราได้ส่งรายละเอียดคำสั่งซื้อไปยังอีเมลของคุณแล้ว
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-amber-800">
            <span className="font-medium">⏱️ การดำเนินการ:</span>{' '}
            ทีมงานจะตรวจสอบการชำระเงินและจัดส่งสินค้าภายใน 1-2 วันทำการ
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 mb-6 text-center">
          <p className="text-sm text-gray-600">
            กำลังนำคุณไปยังหน้าสมาชิกใน{' '}
            <span className="font-bold text-green-600">{countdown}</span> วินาที...
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            className="flex-1 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            onClick={handleGoToMember}
          >
            ไปยังหน้าสมาชิก
          </button>
          <button
            type="button"
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            onClick={handleViewOrder}
          >
            ดูรายละเอียดคำสั่งซื้อ
          </button>
        </div>
      </div>
    </Modal>
  )
}
