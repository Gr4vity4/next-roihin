'use client'

import { Link } from '@/i18n/navigation'
import { fetchRecentlyDiyDesigns } from '@/lib/api/recently-diy'
import { DIYCreation } from '@/lib/types/diy-creation'
import { useEffect, useState } from 'react'
import { useLocale } from 'next-intl'
import DIYCreationCard from './DIYCreationCard'
import DIYCreationModal from './DIYCreationModal'

export default function LatestDIYCreations() {
  const [selectedCreation, setSelectedCreation] = useState<DIYCreation | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [creations, setCreations] = useState<DIYCreation[]>([])
  const locale = (useLocale() as 'th' | 'en') ?? 'th'

  useEffect(() => {
    let mounted = true

    fetchRecentlyDiyDesigns(8, locale).then((items) => {
      if (!mounted || items.length === 0) return
      setCreations(items)
    })

    return () => {
      mounted = false
    }
  }, [locale])

  const handleCardClick = (creation: DIYCreation) => {
    setSelectedCreation(creation)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedCreation(null), 200)
  }

  return (
    <section className="py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">ผลงาน DIY ล่าสุด</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            สำรวจผลงานการออกแบบสร้อยข้อมือหินเฉพาะบุคคลจากลูกค้าของเรา
            เพื่อเป็นแรงบันดาลใจในการสร้างสรรค์ผลงานของคุณเอง
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {creations.map((creation) => (
            <DIYCreationCard
              key={creation.id}
              creation={creation}
              onClick={() => handleCardClick(creation)}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/custom"
            className="inline-flex items-center gap-2 px-6 py-3 border hover:bg-gray-50"
          >
            ดูผลงานทั้งหมด
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </div>
      </div>

      <DIYCreationModal
        creation={selectedCreation}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  )
}
