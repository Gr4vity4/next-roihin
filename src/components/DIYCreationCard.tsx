'use client'

import { DIYCreation } from '@/lib/types/diy-creation'
import { useLocale } from 'next-intl'
import Image from 'next/image'

interface DIYCreationCardProps {
  creation: DIYCreation
  onClick: () => void
}

export default function DIYCreationCard({ creation, onClick }: DIYCreationCardProps) {
  const locale = useLocale()
  const isThai = locale === 'th'

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={creation.thumbnail}
          alt={creation.title}
          fill
          className="object-contain group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
          {isThai ? creation.titleTh : creation.title}
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          {isThai ? 'โดย' : 'By'} {isThai ? creation.designerNameTh : creation.designerName}
        </p>
        <div className="flex items-center gap-1">
          {creation.stones.slice(0, 3).map((stone, index) => (
            <div
              key={index}
              className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 ring-1 ring-white"
              title={isThai ? stone.nameTh : stone.name}
            />
          ))}
          {creation.stones.length > 3 && (
            <span className="text-xs text-gray-500 ml-1">+{creation.stones.length - 3}</span>
          )}
        </div>
      </div>
    </div>
  )
}
