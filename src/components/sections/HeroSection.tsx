'use client'

import { Link } from '@/i18n/navigation'
import Button from '../Button'
import ParallaxSection from '../ParallaxSection'
import { Container, Typography } from '../ui'
import { useTranslations } from 'next-intl'

interface HeroSectionProps {
  backgroundImage: string
  backgroundAlt: string
  overlayOpacity?: number
  parallaxSpeed?: number
  ctaButton: {
    text?: string
    translationKey?: string
    variant: 'primary' | 'gold' | 'green' | 'outline' | 'ghost'
    onClick?: () => void
    href?: string
    size?: 'sm' | 'md' | 'lg'
    highlight?: boolean
  }
  className?: string
  minHeight?: string
}

export default function HeroSection({
  backgroundImage,
  backgroundAlt,
  overlayOpacity = 0.4,
  parallaxSpeed = 0.5,
  ctaButton,
  className = '',
  minHeight = 'min-h-screen',
}: HeroSectionProps) {
  const t = useTranslations()

  const buttonText = ctaButton.translationKey ? t(`common.${ctaButton.translationKey}`) : ctaButton.text

  return (
    <ParallaxSection
      imageUrl={backgroundImage}
      imageAlt={backgroundAlt}
      overlayOpacity={overlayOpacity}
      parallaxSpeed={parallaxSpeed}
      className={`${minHeight} flex items-center justify-center ${className}`}
    >
      <Container className="text-center text-white">
        <Typography variant="h2" textShadow className="mb-10">
          {t('homePage.hero.title')}
          <br />
          <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl">
            {t('homePage.hero.subtitle')}
          </span>
        </Typography>
        {ctaButton.href ? (
          <Link href={ctaButton.href}>
            <Button
              variant={ctaButton.variant}
              size={ctaButton.size || 'lg'}
              highlight={ctaButton.highlight}
            >
              {buttonText}
            </Button>
          </Link>
        ) : (
          <Button
            variant={ctaButton.variant}
            size={ctaButton.size || 'lg'}
            highlight={ctaButton.highlight}
            onClick={ctaButton.onClick}
          >
            {buttonText}
          </Button>
        )}
      </Container>
    </ParallaxSection>
  )
}
