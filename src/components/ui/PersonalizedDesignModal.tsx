'use client'

import { X } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface PersonalizedDesignModalProps {
  isOpen: boolean
  onClose: () => void
  images?: string[]
  title?: string
}

export function PersonalizedDesignModal({
  isOpen,
  onClose,
  images = [],
  title = 'ออกแบบโดย',
}: PersonalizedDesignModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  // Mock data matching the reference design
  const mockImages =
    images.length > 0
      ? images
      : [
          '/images/placeholder-bracelet-1.jpg',
          '/images/placeholder-bracelet-2.jpg',
          '/images/placeholder-bracelet-3.jpg',
          '/images/placeholder-bracelet-4.jpg',
        ]

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleEscape)
    }
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const properties = [
    { name: 'การเงิน โชคลาภ', rating: 5, label: 'ดีเยี่ยมที่สุด' },
    { name: 'การงาน ธุรกิจ การลงทุน', rating: 5, label: 'ดีมาก' },
    { name: 'ความรัก ความสุข โชคดี', rating: 3, label: 'ปานกลาง' },
    { name: 'สุขภาพ สมดุลชีวิต', rating: 3, label: 'ปานกลาง' },
    { name: 'จิตวิญญาณ ความมั่นคง', rating: 4, label: 'ดี' },
  ]

  const stones = [
    'Black Tourmaline',
    'Red Garnet',
    "Red Tiger's Eye",
    'Labradorite',
    'Phantom Amethyst',
    'Golden Rutilated Quartz',
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div className="relative w-full h-full md:h-auto md:max-h-[90vh] md:w-[90vw] md:max-w-6xl bg-white md:rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>

        {/* Modal Body - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid md:grid-cols-2 gap-0 md:gap-8 p-6 md:p-8">
            {/* Left Section - Image Gallery */}
            <div className="space-y-6 mb-8 md:mb-0">
              {/* Main Image */}
              <div className="relative aspect-square w-full bg-gray-100 rounded-2xl overflow-hidden">
                <Image
                  src={mockImages[selectedImageIndex]}
                  alt="Personalized Bracelet"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 45vw"
                  priority
                />
              </div>

              {/* Thumbnail Strip */}
              <div className="grid grid-cols-4 gap-3">
                {mockImages.slice(0, 4).map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? 'border-green-700 ring-2 ring-green-700 ring-offset-2'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 25vw, 12vw"
                    />
                  </button>
                ))}
              </div>

              {/* Designer Info and Actions */}
              <div className="pt-6 flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">{title}</p>
                  <p className="font-medium text-gray-800">ROIHIN Stone & Bracelet</p>
                  <p className="text-xs text-gray-500">22 August 2025</p>
                </div>
                <div className="flex gap-3 pt-1">
                  <button
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Add to wishlist"
                  >
                    <svg
                      className="w-5 h-5 text-gray-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                  <button
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Share"
                  >
                    <svg
                      className="w-5 h-5 text-gray-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Footer Copyright Text */}
              <div className="pt-4">
                <p className="text-xs text-gray-600 leading-relaxed">
                  รูปภาพ วิดีโอ รูปแบบการจัดวางคริสตัลและคำอธิบายพลังงาน ถือเป็นทรัพย์สินทางปัญญา
                  ห้ามมิให้ผู้อื่นทำซ้ำ คัดลอก ดัดแปลง โดยไม่ได้รับอนุญาต
                  <br />
                  &copy; 2025 ROIHIN Stone & Bracelet under s 195 co., ltd. All rights reserved.
                </p>
              </div>
            </div>

            {/* Right Section - Details */}
            <div className="space-y-6">
              {/* Title */}
              <h2 className="text-3xl md:text-4xl font-light text-gray-800">คำอธิบายพลังงาน</h2>

              {/* Description */}
              <div className="text-gray-700 leading-relaxed text-sm md:text-base space-y-2">
                <p>
                  กำไลเส้นนี้เปล่งประกายพลังแห่งความมั่นใจและการตัดสินใจที่เฉียบขาด
                  เสริมไฟในใจให้ลุกไหม้ นำพลังงานแห่งความกล้าและแรงขับเคลื่อนมาเถื่อ
                  หนุนการงานและการเงิน ช่วยปลดหนี้และสร้างโอกาสใหม่ ๆ ด้านการเงิน ได้อย่างมั่นคง
                  พลังงานของหินยังค่อยปกป้องจากสิ่งไม่ดีและพลังลบ เสริมสุขภาพทั้งกายและใจให้แข็งแรง
                  พร้อมทั้งช่วยให้จิตใจสงบ มีสมาธิ ลดความฟุ้งซ่าน
                  และเพิ่มความเฉียบแหลมในความคิดและความจำ เถื่อ หนุนพลังจิตวิญญาณให้สูงขึ้น
                  ในด้านความสัมพันธ์ กำไลช่วยเสริมความ เข้าใจและความผกพันกับคู่ครอง
                  ทำให้ความรักมั่นคงและรำรับ อีกทั้ง ยังดึงดูดโชคดี ไม่ว่าจะเป็นโชคลาภ
                  การได้เพื่อนร่วมงานดี ๆ หรือโอกาสที่ นำประกำใจ
                  กำไลเส้นนี้จึงเป็นเครื่องรางที่ครอบคลุมทั้งพลังแห่งความ สำเร็จ ความสุข ความรัก
                  และการคุ้มครองให้แคล้วคลาดปลอดภัย
                </p>
              </div>

              {/* Properties Table */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-800">คะแนนพลังงาน</h3>
                {properties.map((prop, index) => (
                  <div key={index} className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-gray-700 flex-1">{prop.name}</span>
                    <div className="flex gap-1">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-3 h-3 rounded-full ${
                            i < prop.rating ? 'bg-green-700' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-600 text-xs w-20 text-right">{prop.label}</span>
                  </div>
                ))}
              </div>

              {/* Stones Used */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-800">หินที่ใช้ในการออกแบบ</h3>
                <div className="flex flex-wrap gap-2">
                  {stones.map((stone, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 border border-gray-300 rounded-full text-sm text-gray-700 hover:border-gray-400 transition-colors"
                    >
                      {stone}
                    </span>
                  ))}
                </div>
              </div>

              {/* Charm and Size Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-800 text-sm">ชาร์มและตัวคั่น</h3>
                  <div className="px-4 py-3 border border-gray-300 rounded-full text-sm text-gray-700 text-center">
                    None
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-800 text-sm">ขนาดหิน</h3>
                  <div className="px-4 py-3 border border-gray-300 rounded-full text-sm text-gray-700 text-center">
                    8 mm.
                  </div>
                </div>
              </div>

              {/* Price and Production Time */}
              <div className="space-y-2">
                <h3 className="font-medium text-gray-800 text-sm">งบประมาณการจัดทำ</h3>
                <div className="px-6 py-3 border border-gray-300 rounded-full text-center text-gray-700">
                  ระดับสูง (8,000 ขึ้นไป)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
