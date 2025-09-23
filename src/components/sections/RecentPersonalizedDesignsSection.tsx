import { getRecentPersonalizedDesigns } from '@/lib/api/gallery'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'
import { Container } from '../ui'

export default async function RecentPersonalizedDesignsSection() {
  const t = await getTranslations('personalizedPage.recentDesigns')

  // Fetch random 8 images from WordPress API
  const galleryImages = await getRecentPersonalizedDesigns(8)

  // If no images available, don't render the section
  if (galleryImages.length === 0) {
    return null
  }

  // Ensure we have exactly 8 slots (fill empty ones with placeholders)
  const displayImages = [...galleryImages]
  while (displayImages.length < 8) {
    displayImages.push('')
  }

  return (
    <section className="py-16 sm:py-20 md:py-24">
      <Container padding="lg">
        <div className="max-w-6xl mx-auto">
          {/* Top Divider */}
          <div className="flex justify-center mb-12">
            <div className="w-32 sm:w-48 md:w-64 h-[1px] bg-gray-300" />
          </div>

          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-playfair font-light text-gray-800 mb-2">
              {t('title')}
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 font-prompt">{t('subtitle')}</p>
          </div>

          {/* Gallery Grid - 4 columns on desktop, 2 on mobile */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12">
            {displayImages.slice(0, 8).map((imageUrl, index) => (
              <div
                key={`recent-design-${index}`}
                className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100 shadow-sm"
              >
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={`${t('imageAlt')} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    // Priority loading for first 4 images
                    priority={index < 4}
                    loading={index >= 4 ? 'lazy' : undefined}
                  />
                ) : (
                  // Empty placeholder for missing images
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
                )}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/bracelet-order"
              className="w-full sm:w-auto px-8 py-3 bg-green-700 hover:bg-green-800 text-white font-prompt rounded-md transition-colors text-center"
            >
              {t('orderButton')}
            </Link>
            <button className="w-full sm:w-auto px-8 py-3 bg-[#D4AF37] hover:bg-[#B8941F] text-white font-prompt rounded-md transition-colors">
              {t('viewMoreButton')}
            </button>
          </div>
        </div>
      </Container>
    </section>
  )
}
