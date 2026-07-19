'use client'

import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { ReactNode } from 'react'
import Button from './Button'
import ParallaxSection from './ParallaxSection'
import { Container, Typography } from './ui'

interface ParallaxContentSectionProps {
  // Parallax configuration
  imageUrl: string
  imageAlt: string
  overlayOpacity?: number
  parallaxSpeed?: number

  // Content
  title?: string
  subtitle?: string
  content?: ReactNode
  ctaButtons?: Array<{
    text?: string
    translationKey?: string
    variant: 'primary' | 'gold' | 'green' | 'outline' | 'ghost'
    onClick?: () => void
    href?: string
    highlight?: boolean
  }>

  // Layout
  contentAlign?: 'left' | 'center' | 'right'
  contentMaxWidth?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  minHeight?: string
}

const alignmentClasses = {
  left: 'text-left items-start',
  center: 'text-center items-center',
  right: 'text-right items-end',
}

export default function ParallaxContentSection({
  imageUrl,
  imageAlt,
  overlayOpacity = 0.5,
  parallaxSpeed = 0.5,
  title,
  subtitle,
  content,
  ctaButtons,
  contentAlign = 'center',
  contentMaxWidth = 'lg',
  className = '',
  minHeight = 'min-h-[750px]',
}: ParallaxContentSectionProps) {
  const t = useTranslations()

  // Add special background positioning for SignatureCharm
  const backgroundPosition = title === 'SIGNATURE CHARM' ? 'center 20%' : 'center center'

  return (
    <ParallaxSection
      imageUrl={imageUrl}
      imageAlt={imageAlt}
      overlayOpacity={overlayOpacity}
      parallaxSpeed={parallaxSpeed}
      className={cn('py-12', minHeight, className)}
      backgroundPosition={backgroundPosition}
    >
      <div className="flex items-center justify-center h-full">
        <Container
          maxWidth={contentMaxWidth}
          className={alignmentClasses[contentAlign]}
          padding="lg"
        >
          {/* Special layout for Signature Charm section */}
          {title === 'SIGNATURE CHARM' ? (
            <div className="flex flex-col justify-between h-full min-h-[600px] text-white pt-8">
              {/* First group: Title and Button */}
              <div className="flex flex-col items-center space-y-6">
                {title && (
                  <Typography variant="h2" textShadow align={contentAlign}>
                    {t('homePage.signatureCharm.title')}
                  </Typography>
                )}

                {ctaButtons && ctaButtons.length > 0 && (
                  <div
                    className={cn(
                      'flex gap-4',
                      contentAlign === 'center' && 'justify-center',
                      contentAlign === 'left' && 'justify-start',
                      contentAlign === 'right' && 'justify-end',
                      ctaButtons.length > 1 && 'flex-col md:flex-row',
                    )}
                  >
                    {ctaButtons.map((button, index) => {
                      const buttonText = button.translationKey
                        ? t(`common.${button.translationKey}`)
                        : button.text
                      const buttonClassName =
                        'px-6 py-3 text-md md:text-lg font-semibold text-white rounded-md border-2 hover:border-white transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent'
                      return button.href ? (
                        <Link key={index} href={button.href} className={buttonClassName}>
                          {buttonText}
                        </Link>
                      ) : (
                        <button
                          key={index}
                          onClick={button.onClick}
                          className={buttonClassName}
                        >
                          {buttonText}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Second group: Subtitle */}
              {subtitle && (
                <div className="flex items-end">
                  <Typography
                    variant="body"
                    className="text-gray-100 text-center max-w-3xl mx-auto"
                    align={contentAlign}
                  >
                    {t('homePage.signatureCharm.subtitle')}
                  </Typography>
                </div>
              )}
            </div>
          ) : (
            /* Default layout for other sections */
            <div className="space-y-6 text-white">
              {title && (
                <Typography variant="h2" textShadow align={contentAlign}>
                  {title}
                </Typography>
              )}

              {subtitle && (
                <Typography variant="body" className="text-gray-300" align={contentAlign}>
                  {subtitle}
                </Typography>
              )}

              {content && <div className="mt-8">{content}</div>}

              {ctaButtons && ctaButtons.length > 0 && (
                <div
                  className={cn(
                    'mt-10 flex gap-4',
                    contentAlign === 'center' && 'justify-center',
                    contentAlign === 'left' && 'justify-start',
                    contentAlign === 'right' && 'justify-end',
                    ctaButtons.length > 1 && 'flex-col md:flex-row',
                  )}
                >
                  {ctaButtons.map((button, index) => {
                    const buttonText = button.translationKey
                      ? t(`common.${button.translationKey}`)
                      : button.text
                    return (
                      <Button
                        key={index}
                        variant={button.variant}
                        size="lg"
                        highlight={button.highlight}
                        onClick={button.onClick}
                      >
                        {buttonText}
                      </Button>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </Container>
      </div>
    </ParallaxSection>
  )
}
