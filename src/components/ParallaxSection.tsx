'use client'

import Image from 'next/image'
import { ReactNode, useEffect, useRef, useState } from 'react'

interface ParallaxSectionProps {
  imageUrl: string
  imageAlt: string
  children: ReactNode
  overlayOpacity?: number
  parallaxSpeed?: number
  className?: string
}

export default function ParallaxSection({
  imageUrl,
  imageAlt,
  children,
  overlayOpacity = 0.4,
  parallaxSpeed = 0.5,
  className = '',
}: ParallaxSectionProps) {
  const parallaxRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)
  const rafId = useRef<number | undefined>(undefined)

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const handleScroll = () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }

      rafId.current = requestAnimationFrame(() => {
        if (!parallaxRef.current) return

        const scrolled = window.scrollY
        const sectionTop = parallaxRef.current.offsetTop
        const sectionHeight = parallaxRef.current.offsetHeight
        const windowHeight = window.innerHeight

        // Check if section is in viewport
        const inView =
          scrolled + windowHeight >= sectionTop && scrolled <= sectionTop + sectionHeight
        setIsInView(inView)

        if (inView && imageRef.current) {
          // Calculate relative position within viewport
          const scrollProgress =
            (scrolled + windowHeight - sectionTop) / (windowHeight + sectionHeight)

          // Calculate parallax offset based on progress through the section
          const parallaxOffset = scrollProgress * sectionHeight * parallaxSpeed
          const yPos = -parallaxOffset

          imageRef.current.style.transform = `translate3d(0, ${yPos}px, 0)`
        }
      })
    }

    // Add passive listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial position

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [parallaxSpeed])

  return (
    <section ref={parallaxRef} className={`relative overflow-hidden ${className}`}>
      {/* Parallax Background Image or Black Background */}
      {imageUrl && imageUrl.trim() !== '' ? (
        <div
          ref={imageRef}
          className="absolute z-0 will-change-transform"
          style={{
            left: 0,
            right: 0,
            top: 0,
            height: `${100 + parallaxSpeed * 100}%`,
          }}
        >
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-cover"
            priority={isInView}
            quality={90}
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` }}
          />
        </div>
      ) : (
        <>
          {/* Black background when no image is provided */}
          <div className="absolute inset-0 z-0 bg-black" />
        </>
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </section>
  )
}
