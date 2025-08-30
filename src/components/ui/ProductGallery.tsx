import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

interface ProductGalleryProps {
  images: {
    src: string
    alt: string
    href?: string
    title?: string
    price?: number
  }[]
  columns?: 4 | 6
  spacing?: 'tight' | 'normal' | 'loose'
  className?: string
}

export default function ProductGallery({
  images,
  columns = 4,
  spacing = 'normal',
  className,
}: ProductGalleryProps) {
  const spacingClasses = {
    tight: 'gap-2 md:gap-3',
    normal: 'gap-4 md:gap-6',
    loose: 'gap-6 md:gap-8',
  }

  const columnClasses = {
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    6: 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6',
  }

  return (
    <div className={cn('grid', columnClasses[columns], spacingClasses[spacing], className)}>
      {images.map((image, index) => {
        const imageElement = (
          <div className="space-y-2">
            <div className="relative aspect-square overflow-hidden bg-gray-900 group">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              {/* Watermark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-2 left-2 right-2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-[10px] text-white/80 ">ROIHIN STONE & BRACELET, THAILAND</p>
              </div>
            </div>
            {(image.title || image.price) && (
              <div className="text-center space-y-1">
                {image.title && (
                  <h3 className="text-sm text-white/90 font-medium line-clamp-1">{image.title}</h3>
                )}
                {image.price && (
                  <p className="text-xs text-gray-400">฿{image.price.toLocaleString('th-TH')}</p>
                )}
              </div>
            )}
          </div>
        )

        return image.href ? (
          <Link key={index} href={image.href} className="block cursor-pointer">
            {imageElement}
          </Link>
        ) : (
          <div key={index}>{imageElement}</div>
        )
      })}
    </div>
  )
}
