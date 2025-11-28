'use client'

import DIYCreationCard from '@/components/DIYCreationCard'
import DIYCreationModal from '@/components/DIYCreationModal'
import { DIYCreation } from '@/lib/types/diy-creation'
import { useState } from 'react'

interface DIYCreationsGalleryProps {
  creations: DIYCreation[]
  emptyTitle: string
  emptyDescription: string
}

export default function DIYCreationsGallery({
  creations,
  emptyTitle,
  emptyDescription,
}: DIYCreationsGalleryProps) {
  const [selectedCreation, setSelectedCreation] = useState<DIYCreation | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCardClick = (creation: DIYCreation) => {
    setSelectedCreation(creation)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedCreation(null), 200)
  }

  if (!creations.length) {
    return (
      <div className="mx-auto max-w-2xl rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center text-gray-700">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">{emptyTitle}</h3>
        <p className="text-gray-600">{emptyDescription}</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {creations.map((creation) => (
          <DIYCreationCard
            key={creation.id}
            creation={creation}
            onClick={() => handleCardClick(creation)}
          />
        ))}
      </div>

      <DIYCreationModal
        creation={selectedCreation}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  )
}
