'use client'

import ParallaxSection from '../ParallaxSection'
import { Container, Typography } from '../ui'

interface FullWidthBackgroundSectionProps {
  id?: string
  backgroundImage: string
  backgroundAlt: string
  overlayOpacity?: number
  parallaxSpeed?: number
  title?: string
  subtitle?: string
  className?: string
  minHeight?: string
}

export default function FullWidthBackgroundSection({
  id,
  backgroundImage,
  backgroundAlt,
  overlayOpacity = 0.3,
  parallaxSpeed = 0.3,
  title,
  subtitle,
  className = '',
  minHeight = 'min-h-[70vh]',
}: FullWidthBackgroundSectionProps) {
  return (
    <section id={id}>
      <ParallaxSection
        imageUrl={backgroundImage}
        imageAlt={backgroundAlt}
        overlayOpacity={overlayOpacity}
        parallaxSpeed={parallaxSpeed}
        className={`${minHeight} flex items-center justify-center ${className}`}
      >
        {(title || subtitle) && (
          <Container className="text-center text-white">
            {title && (
              <Typography
                variant="h2"
                fontFamily="mixed-lang"
                textShadow
                className="mb-4"
              >
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography
                variant="body"
                fontFamily="thai"
                textShadow
                className="max-w-3xl mx-auto"
              >
                {subtitle}
              </Typography>
            )}
          </Container>
        )}
      </ParallaxSection>
    </section>
  )
}