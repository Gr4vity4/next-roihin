'use client'

import Image, { getImageProps } from 'next/image'
import { ReactNode, useEffect, useRef, useState } from 'react'

interface ParallaxSectionProps {
  imageUrl: string
  /** Art-direction variant served below the md breakpoint instead of imageUrl */
  mobileImageUrl?: string
  imageAlt: string
  children: ReactNode
  overlayOpacity?: number
  parallaxSpeed?: number
  className?: string
  backgroundPosition?: string
  /**
   * Tailwind object-position classes for the art-directed <img> (e.g. "object-top md:object-center").
   * When set, these win over `backgroundPosition` (which is inline and can't be responsive).
   */
  objectPositionClassName?: string
}

export default function ParallaxSection({
  imageUrl,
  mobileImageUrl,
  imageAlt,
  children,
  overlayOpacity = 0.4,
  parallaxSpeed = 0.5,
  className = '',
  backgroundPosition = 'center center',
  objectPositionClassName,
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

  const hasImage = Boolean(imageUrl && imageUrl.trim() !== '')

  let artDirected: {
    desktopSrcSet?: string
    desktopSizes?: string
    mobileProps?: ReturnType<typeof getImageProps>['props']
  } = {}
  if (hasImage && mobileImageUrl) {
    const shared = {
      alt: imageAlt,
      fill: true as const,
      quality: 90,
      sizes: '100vw',
      priority: isInView,
    }
    const { props: desktopProps } = getImageProps({ ...shared, src: imageUrl })
    const { props: mobileProps } = getImageProps({ ...shared, src: mobileImageUrl })
    artDirected = {
      // With images.unoptimized there is no srcSet, only a plain src
      desktopSrcSet: desktopProps.srcSet ?? desktopProps.src,
      desktopSizes: desktopProps.srcSet ? desktopProps.sizes : undefined,
      mobileProps,
    }
  }

  return (
    <section ref={parallaxRef} className={`relative overflow-hidden w-full ${className}`}>
      {/* Parallax Background Image or Black Background */}
      {hasImage ? (
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
          {artDirected.mobileProps ? (
            <picture>
              <source
                media="(min-width: 768px)"
                srcSet={artDirected.desktopSrcSet}
                sizes={artDirected.desktopSizes}
              />
              <img
                {...artDirected.mobileProps}
                alt={imageAlt}
                className={`object-cover${objectPositionClassName ? ` ${objectPositionClassName}` : ''}`}
                style={{
                  ...artDirected.mobileProps.style,
                  // Responsive position classes take over when provided; inline can't do breakpoints
                  ...(objectPositionClassName ? {} : { objectPosition: backgroundPosition }),
                }}
              />
            </picture>
          ) : (
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              className="object-cover"
              style={{ objectPosition: backgroundPosition }}
              priority={isInView}
              quality={90}
              sizes="100vw"
            />
          )}
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
