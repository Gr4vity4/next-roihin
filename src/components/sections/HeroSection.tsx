'use client'

import { Link } from '@/i18n/navigation'
import Button from '../Button'
import ParallaxSection from '../ParallaxSection'
import { Container, Typography } from '../ui'
import { useTranslations } from '@/contexts/TranslationContext'
import { useTranslations as useNextIntlTranslations } from 'next-intl'

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
  title,
  ctaButton,
  className = '',
  minHeight = 'min-h-screen',
}: HeroSectionProps) {
  const { translations } = useTranslations()
  const t = useNextIntlTranslations('common')

  const buttonText = ctaButton.translationKey ? t(ctaButton.translationKey) : ctaButton.text

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
          {translations?.acf?.home_p1 ? (
            <span dangerouslySetInnerHTML={{ __html: translations.acf.home_p1.replace(/\r\n/g, '<br />') }} />
          ) : (
            title.line1
          )}
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
