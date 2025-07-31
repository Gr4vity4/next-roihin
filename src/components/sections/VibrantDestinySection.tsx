'use client'

import ParallaxSection from '../ParallaxSection'
import { Typography } from '../ui'

interface VibrantDestinySectionProps {
  backgroundImage: string
  backgroundAlt: string
  title: string
  subtitle: string
  since: string
  overlayOpacity?: number
  parallaxSpeed?: number
  className?: string
}

export default function VibrantDestinySection({
  backgroundImage,
  backgroundAlt,
  title,
  subtitle,
  since,
  overlayOpacity = 0.5,
  parallaxSpeed = 0.4,
  className = '',
}: VibrantDestinySectionProps) {
  return (
    <ParallaxSection
      imageUrl={backgroundImage}
      imageAlt={backgroundAlt}
      overlayOpacity={overlayOpacity}
      parallaxSpeed={parallaxSpeed}
      className={`py-32 ${className}`}
    >
      <div className="flex flex-col items-center justify-center px-4 text-center text-white min-h-[520px]">
        <Typography variant="h2" fontFamily="playfair" textShadow className="mb-8">
          {title}
        </Typography>
        <Typography variant="h3" className="mb-4 tracking-wide">
          {subtitle}
        </Typography>
        <Typography variant="body" className="font-light tracking-widest text-xl md:text-2xl">
          {since}
        </Typography>
      </div>
    </ParallaxSection>
  )
}
