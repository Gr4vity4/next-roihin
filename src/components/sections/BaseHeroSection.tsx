import Image from 'next/image'
import React from 'react'

interface BaseHeroSectionProps {
  backgroundImage: string
  backgroundAlt: string
  overlayOpacity?: number
  height?: string
  className?: string
  children: React.ReactNode
}

export default function BaseHeroSection({
  backgroundImage,
  backgroundAlt,
  overlayOpacity = 0,
  height = 'h-[40vh] md:h-[70vh]',
  className = '',
  children,
}: BaseHeroSectionProps) {
  return (
    <section className={`relative ${height} w-full overflow-hidden pt-24 lg:pt-[280px] ${className}`}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt={backgroundAlt}
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        {/* Dark overlay for better text readability */}
        {overlayOpacity > 0 && (
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: overlayOpacity }}
          />
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full">
        {children}
      </div>
    </section>
  )
}