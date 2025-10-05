import Image from 'next/image'
import Link from 'next/link'

export interface Crystal {
  id: string
  slug: string
  nameEn: string
  nameTh: string
  image: string
}

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
          href={`/${currentLocale}/crystal/product/${crystal.slug}`}
          className="group block"
        >
          <div
            className={`relative aspect-square overflow-hidden ${crystal.image ? 'bg-black' : 'bg-gray-800'} rounded-lg mb-3`}
          >
            <Image
              src={crystal.image || '/images/logo.avif'}
              alt={crystal.nameEn}
              fill
              className="object-contain group-hover:scale-110 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            />
          </div>
          <div className="text-center space-y-0.5">
            <h3 className="text-sm md:text-base text-white font-light group-hover:text-gold-500 transition-colors">
              {crystal.nameEn}
            </h3>
            <p className="text-xs md:text-sm text-gray-400">{crystal.nameTh}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
