'use client'

import Image from 'next/image'
import Link from 'next/link'

interface GallerySectionProps {
  backgroundImage: string
  backgroundAlt: string
  title: string
  subtitle: string
  ctaButtons: Array<{
    text: string
    variant: 'gold' | 'green'
    onClick?: () => void
    href?: string
  }>
  overlayOpacity?: number
  parallaxSpeed?: number
  className?: string
}

export default function GallerySection({
  backgroundImage,
  backgroundAlt,
  title,
  subtitle,
  ctaButtons,
  overlayOpacity = 0.6,
  parallaxSpeed = 0.3,
  className = '',
}: GallerySectionProps) {
  const productImages = Array.from({ length: 10 }, (_, i) => ({
    src: `/images/home-page/${i + 1}.png`,
    alt: `Product ${i + 1}`,
  }))

  return (
    <section className={`py-16 bg-black ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-white max-w-3xl mx-auto mb-8 font-fciconic">
            {subtitle}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {ctaButtons.map((button, index) => {
              const buttonClasses = `
                px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 font-fciconic
                ${
                  button.variant === 'gold'
                    ? 'bg-[#D4AF37] text-white hover:bg-[#B8941F]'
                    : 'bg-[#2C5F2D] text-white hover:bg-[#234A24]'
                }
              `

              if (button.href) {
                return (
                  <Link key={index} href={button.href} className={buttonClasses}>
                    {button.text}
                  </Link>
                )
              }

              return (
                <button key={index} onClick={button.onClick} className={buttonClasses}>
                  {button.text}
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {productImages.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
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
