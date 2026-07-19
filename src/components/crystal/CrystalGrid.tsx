import Image from 'next/image'
import Link from 'next/link'

import type { Crystal } from '@/lib/types/crystal'

interface CrystalGridProps {
  crystals: Crystal[]
  currentLocale: string
}

export default function CrystalGrid({ crystals, currentLocale }: CrystalGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
      {crystals.map((crystal) => (
        <Link
          key={crystal.id}
          href={`/${currentLocale}/crystal/${crystal.slug}`}
          className="group block"
        >
          <div
            className={`relative aspect-square overflow-hidden ${
              crystal.previewImage || crystal.image ? 'bg-black' : 'bg-gray-800'
            } rounded-lg mb-3`}
          >
            <Image
              src={crystal.previewImage || crystal.image || '/images/logo.avif'}
              alt={crystal.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            />
          </div>
          <div className="text-center space-y-0.5">
            <h3 className="text-sm md:text-base text-white font-light group-hover:text-gold-500 transition-colors">
              {crystal.title}
            </h3>
            {crystal.subtitle && (
              <p className="text-xs md:text-sm text-gray-400">{crystal.subtitle}</p>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}
