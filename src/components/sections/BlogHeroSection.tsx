import Image, { getImageProps } from 'next/image'
import { Container, Typography } from '../ui'

interface BlogHeroSectionProps {
  backgroundImage: string
  /** Art-direction variant served below the md breakpoint instead of backgroundImage */
  backgroundImageMobile?: string
  title: string
  subtitle: string
  className?: string
}

export default function BlogHeroSection({
  backgroundImage,
  backgroundImageMobile,
  title,
  subtitle,
  className = '',
}: BlogHeroSectionProps) {
  // When a mobile variant is provided, art-direct with <picture>: desktop source at >=768px,
  // mobile <img> as the default. Mirrors the approach in BaseHeroSection.
  let mobileProps: ReturnType<typeof getImageProps>['props'] | undefined
  let desktopSrcSet: string | undefined
  let desktopSizes: string | undefined
  if (backgroundImageMobile) {
    const shared = { alt: title, fill: true as const, sizes: '100vw', priority: true }
    const { props: desktopProps } = getImageProps({ ...shared, src: backgroundImage })
    const { props: mProps } = getImageProps({ ...shared, src: backgroundImageMobile })
    mobileProps = mProps
    // With images.unoptimized there is no srcSet, only a plain src
    desktopSrcSet = desktopProps.srcSet ?? desktopProps.src
    desktopSizes = desktopProps.srcSet ? desktopProps.sizes : undefined
  }

  return (
    <section className={`relative w-full pt-20 min-[1408px]:pt-[230px] ${className}`}>
      {/* Background Image */}
      <div className="relative w-full h-[400px] lg:h-[500px]">
        {mobileProps ? (
          <picture>
            <source media="(min-width: 768px)" srcSet={desktopSrcSet} sizes={desktopSizes} />
            <img
              {...mobileProps}
              alt={title}
              className="object-cover"
            />
          </picture>
        ) : (
          <Image
            src={backgroundImage}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Content — anchored at the bottom, mirroring the crystal page hero */}
        <div className="absolute inset-0 flex items-end justify-center pb-8 lg:pb-12">
          <Container className="text-center text-white">
            <Typography variant="h2" className="mb-2">
              {title}
            </Typography>
            <div className="mt-0 max-w-2xl mx-auto">
              <Typography variant="body" className="text-gray-200">
                {subtitle}
              </Typography>
            </div>
          </Container>
        </div>
      </div>
    </section>
  )
}
