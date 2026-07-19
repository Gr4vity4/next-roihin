'use client'

import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import Button from '../Button'
import { useTranslations } from 'next-intl'

interface GallerySectionProps {
  backgroundImage: string
  backgroundAlt: string
  title?: string
  subtitle?: string
  ctaButtons: Array<{
    text?: string
    translationKey?: string
    variant: 'primary' | 'gold' | 'green' | 'outline' | 'ghost'
    highlight?: boolean
    className?: string
    onClick?: () => void
    href?: string
  }>
  overlayOpacity?: number
  parallaxSpeed?: number
  className?: string
  images?: string[]
}

export default function GallerySection({
  ctaButtons,
  className = '',
  images = [],
}: GallerySectionProps) {
  const t = useTranslations()
  const fallbackImages = Array.from({ length: 10 }, (_, i) => ({
    src: `/images/home-page/${i + 1}.png`,
    alt: `Product ${i + 1}`,
  }))

  const productImages =
    images.length > 0
      ? images.map((src, index) => ({
          src,
          alt: `Inspired gallery design ${index + 1}`,
        }))
      : fallbackImages

  return (
    <section className={`py-16 bg-black ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 max-w-full">
        <div className="text-center mb-12">
          <h2 className="font-mixed-lang text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-8">
            {t('homePage.gallery.title')}
          </h2>
          {/* <p className="text-base sm:text-lg md:text-xl text-white max-w-3xl mx-auto mb-8 ">
            {subtitle}
          </p> */}
          <div className="flex flex-wrap justify-center gap-4">
            {ctaButtons.map((button, index) => {
              const buttonText = button.translationKey ? t(`common.${button.translationKey}`) : button.text
              if (button.href) {
                return (
                  <Link key={index} href={button.href}>
                    <Button
                      variant={button.variant}
                      size="lg"
                      highlight={button.highlight}
                      className={button.className}
                    >
                      {buttonText}
                    </Button>
                  </Link>
                )
              }

              return (
                <Button
                  key={index}
                  variant={button.variant}
                  size="lg"
                  highlight={button.highlight}
                  className={button.className}
                  onClick={button.onClick}
                >
                  {buttonText}
                </Button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
          {productImages.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
