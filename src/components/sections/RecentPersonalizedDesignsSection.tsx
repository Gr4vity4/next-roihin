'use client'

import { Link } from '@/i18n/navigation'
import { getAllRecentPersonalizedDesigns, getRecentPersonalizedDesigns } from '@/lib/api/gallery'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { FontProvider } from '../providers/FontProvider'
import { Container } from '../ui'
import { PersonalizedDesignModal } from '../ui/PersonalizedDesignModal'
import type { LaravelGalleryImage } from '@/lib/types/laravel'

type RecentPersonalizedDesignsSectionProps = {
  initialImages?: LaravelGalleryImage[]
  maxDisplay?: number | null
  showViewMoreButton?: boolean
  viewMoreHref?: string
}

export default function RecentPersonalizedDesignsSection({
  initialImages = [],
  maxDisplay,
  showViewMoreButton = true,
  viewMoreHref = '/personalized/recent-designs',
}: RecentPersonalizedDesignsSectionProps) {
  const t = useTranslations('personalizedPage.recentDesigns')
  const [galleryImages, setGalleryImages] = useState<LaravelGalleryImage[]>(initialImages)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(initialImages.length === 0)
  const isUnlimited = maxDisplay === null
  const effectiveLimit = typeof maxDisplay === 'number' && maxDisplay > 0 ? maxDisplay : 8

  useEffect(() => {
    setGalleryImages(initialImages)
    if (initialImages.length > 0) {
      setIsLoading(false)
    }
  }, [initialImages])

  // Fetch recent personalized gallery images from Laravel API when none are preloaded
  useEffect(() => {
    if (initialImages.length > 0) {
      return
    }

    let isSubscribed = true

    async function fetchImages() {
      try {
        const images = isUnlimited
          ? await getAllRecentPersonalizedDesigns()
          : await getRecentPersonalizedDesigns(effectiveLimit)
        if (!isSubscribed) return
        setGalleryImages(images)
      } catch (error) {
        console.error('Failed to fetch gallery images:', error)
      } finally {
        if (isSubscribed) {
          setIsLoading(false)
        }
      }
    }
    fetchImages()
    return () => {
      isSubscribed = false
    }
  }, [initialImages.length, isUnlimited, effectiveLimit])

  // Don't render if loading or no images
  if (isLoading || galleryImages.length === 0) {
    return null
  }

  // Build the display array, filling empty slots with placeholders when limited
  const displayImages = isUnlimited
    ? galleryImages
    : Array.from({ length: effectiveLimit }, (_, index) => galleryImages[index] ?? null)

  const handleImageClick = (index: number) => {
    const design = galleryImages[index]
    if (!design || !design.image_url) {
      return
    }
    setSelectedImageIndex(index)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedImageIndex(null)
  }

  const selectedDesign = typeof selectedImageIndex === 'number' ? galleryImages[selectedImageIndex] : undefined

  return (
    <FontProvider fonts={{ th: 'font-prompt', en: 'font-playfair' }}>
      <section className="py-16 sm:py-20 md:py-24">
        <Container padding="lg">
          <div className="max-w-6xl mx-auto">
            {/* Top Divider */}
            <div className="flex justify-center mb-12">
              <div className="w-32 sm:w-48 md:w-64 h-[1px] bg-gray-300" />
            </div>

            {/* Section Title */}
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-800 mb-2">
                {t('title')}
              </h2>
              <p className="text-lg sm:text-xl text-gray-600">{t('subtitle')}</p>
            </div>

            {/* Gallery Grid - 4 columns on desktop, 2 on mobile */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12">
              {displayImages.map((design, index) => {
                const imageUrl = design?.image_url ?? ''
                return (
                  <button
                    key={`recent-design-${index}`}
                    onClick={() => imageUrl && handleImageClick(index)}
                    className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100 shadow-sm hover:shadow-lg transition-shadow cursor-pointer disabled:cursor-default group"
                    disabled={!imageUrl}
                    aria-label={imageUrl ? `View design ${index + 1}` : undefined}
                  >
                    {imageUrl ? (
                      <>
                        <Image
                          src={imageUrl}
                          alt={`${t('imageAlt')} ${index + 1}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 50vw, 25vw"
                          // Priority loading for first 4 images
                          priority={index < 4}
                          loading={index >= 4 ? 'lazy' : undefined}
                        />
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                      </>
                    ) : (
                      // Empty placeholder for missing images
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/bracelet-order"
                className="w-full sm:w-auto px-8 py-3 bg-green-700 hover:bg-green-800 text-white rounded-md transition-colors text-center"
              >
                {t('orderButton')}
              </Link>
              {showViewMoreButton ? (
                <Link
                  href={viewMoreHref}
                  className="w-full sm:w-auto px-8 py-3 bg-[#D4AF37] hover:bg-[#B8941F] text-white rounded-md transition-colors text-center"
                >
                  {t('viewMoreButton')}
                </Link>
              ) : null}
            </div>
          </div>
        </Container>
      </section>

      {/* Personalized Design Modal */}
      <PersonalizedDesignModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        design={selectedDesign}
        title={'ออกแบบโดย'}
      />
    </FontProvider>
  )
}
