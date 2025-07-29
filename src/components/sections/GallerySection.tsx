'use client'

import ParallaxContentSection from '../ParallaxContentSection'

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
  return (
    <ParallaxContentSection
      imageUrl={backgroundImage}
      imageAlt={backgroundAlt}
      overlayOpacity={overlayOpacity}
      parallaxSpeed={parallaxSpeed}
      title={title}
      subtitle={subtitle}
      ctaButtons={ctaButtons}
      contentAlign="center"
      contentMaxWidth="lg"
      className={className}
    />
  )
}