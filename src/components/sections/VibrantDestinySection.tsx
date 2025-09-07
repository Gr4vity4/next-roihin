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
      className={`${className}`}
    >
      <div className="flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 text-center text-white min-h-[320px] max-w-full">
        <Typography variant="h2" textShadow className="mb-8">
          {title}
        </Typography>
        <Typography variant="h3" className="mb-4 tracking-wide">
          {subtitle}
        </Typography>
        <Typography
          variant="body"
          className="font-light tracking-widest text-lg sm:text-xl md:text-2xl"
        >
          {since}
        </Typography>
      </div>
    </ParallaxSection>
  )
}
