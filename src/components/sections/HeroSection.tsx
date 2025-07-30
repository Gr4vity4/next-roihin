'use client'

import Button from '../Button'
import ParallaxSection from '../ParallaxSection'
import { Container, Typography } from '../ui'

interface HeroSectionProps {
  backgroundImage: string
  backgroundAlt: string
  overlayOpacity?: number
  parallaxSpeed?: number
  title: {
    line1: string
    line2: string
  }
  subtitle: {
    thai: string
    english: string
  }
  ctaButton: {
    text: string
    variant: 'primary' | 'gold' | 'green' | 'outline' | 'ghost'
    onClick?: () => void
    href?: string
    size?: 'sm' | 'md' | 'lg'
  }
  className?: string
  minHeight?: string
}

export default function HeroSection({
  backgroundImage,
  backgroundAlt,
  overlayOpacity = 0.4,
  parallaxSpeed = 0.5,
  title,
  subtitle,
  ctaButton,
  className = '',
  minHeight = 'min-h-screen',
}: HeroSectionProps) {
  return (
    <ParallaxSection
      imageUrl={backgroundImage}
      imageAlt={backgroundAlt}
      overlayOpacity={overlayOpacity}
      parallaxSpeed={parallaxSpeed}
      className={`${minHeight} flex items-center justify-center ${className}`}
    >
      <Container className="text-center text-white">
        <Typography variant="h2" fontFamily="playfair" textShadow className="mb-2">
          {title.line1}
        </Typography>
        <Typography variant="h3" fontFamily="playfair" textShadow className="mb-6">
          {title.line2}
        </Typography>
        <Typography variant="h3" fontFamily="thai" textShadow className="mb-4 font-light">
          {subtitle.thai}
        </Typography>
        <Typography variant="body" fontFamily="thai" textShadow className="mb-10 max-w-2xl mx-auto">
          {subtitle.english}
        </Typography>
        <Button
          variant={ctaButton.variant}
          size={ctaButton.size || 'lg'}
          onClick={ctaButton.onClick}
        >
          {ctaButton.text}
        </Button>
      </Container>
    </ParallaxSection>
  )
}
