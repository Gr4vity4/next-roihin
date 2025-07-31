'use client'

import ParallaxContentSection from '../ParallaxContentSection'

interface SignatureCharmSectionProps {
  id?: string
  backgroundImage: string
  backgroundAlt: string
  overlayOpacity?: number
  parallaxSpeed?: number
  title: string
  subtitle: string
  ctaButton?: {
    text: string
    variant: 'primary' | 'gold' | 'green' | 'outline' | 'ghost'
    onClick?: () => void
    href?: string
    highlight?: boolean
  }
  className?: string
}

export default function SignatureCharmSection({
  id,
  backgroundImage,
  backgroundAlt,
  overlayOpacity = 0.7,
  parallaxSpeed = 0.4,
  title,
  subtitle,
  ctaButton,
  className = '',
}: SignatureCharmSectionProps) {
  return (
    <div id={id}>
      <ParallaxContentSection
        imageUrl={backgroundImage}
        imageAlt={backgroundAlt}
        overlayOpacity={overlayOpacity}
        parallaxSpeed={parallaxSpeed}
        title={title}
        subtitle={subtitle}
        ctaButtons={ctaButton ? [ctaButton] : undefined}
        contentAlign="center"
        contentMaxWidth="lg"
        className={className}
        minHeight="min-h-[750px]"
      />
    </div>
  )
}