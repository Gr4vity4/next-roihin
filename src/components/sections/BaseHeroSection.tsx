import Image, { getImageProps } from 'next/image'
import React from 'react'

interface BaseHeroSectionProps {
  backgroundImage: string
  /** Art-direction variant served below the md breakpoint instead of backgroundImage */
  backgroundImageMobile?: string
  backgroundAlt: string
  overlayOpacity?: number
  height?: string
  className?: string
  children?: React.ReactNode
}

export default function BaseHeroSection({
  backgroundImage,
  backgroundImageMobile,
  backgroundAlt,
  overlayOpacity = 0,
  height = 'h-[40vh] md:h-[90vh]',
  className = '',
  children,
}: BaseHeroSectionProps) {
  // When a mobile variant is provided, art-direct with <picture>: desktop source at >=768px,
  // mobile <img> as the default. Mirrors the approach in ParallaxSection.
  let mobileProps: ReturnType<typeof getImageProps>['props'] | undefined
  let desktopSrcSet: string | undefined
  let desktopSizes: string | undefined
  if (backgroundImageMobile) {
    const shared = { alt: backgroundAlt, fill: true as const, sizes: '100vw', priority: true }
    const { props: desktopProps } = getImageProps({ ...shared, src: backgroundImage })
    const { props: mProps } = getImageProps({ ...shared, src: backgroundImageMobile })
    mobileProps = mProps
    // With images.unoptimized there is no srcSet, only a plain src
    desktopSrcSet = desktopProps.srcSet ?? desktopProps.src
    desktopSizes = desktopProps.srcSet ? desktopProps.sizes : undefined
  }

  return (
    <section className={`relative ${height} w-full overflow-hidden pt-24 lg:pt-[280px] ${className}`}>
      {/* Background Image */}
      <div className="absolute inset-0">
        {mobileProps ? (
          <picture>
            <source media="(min-width: 768px)" srcSet={desktopSrcSet} sizes={desktopSizes} />
            <img
              {...mobileProps}
              alt={backgroundAlt}
              className="object-cover object-center"
            />
          </picture>
        ) : (
          <Image
            src={backgroundImage}
            alt={backgroundAlt}
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
        )}
        {/* Dark overlay for better text readability */}
        {overlayOpacity > 0 && (
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: overlayOpacity }}
          />
        )}
      </div>

      {/* Content */}
      {children && (
        <div className="relative z-10 flex h-full">
          {children}
        </div>
      )}
    </section>
  )
}