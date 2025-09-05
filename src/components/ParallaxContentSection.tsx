'use client'

import ParallaxSection from './ParallaxSection'
import { Container, Typography } from './ui'
import Button from './Button'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { useTranslations } from '@/contexts/TranslationContext'

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
    text: string
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
  const { translations } = useTranslations()
  return (
    <ParallaxSection
      imageUrl={imageUrl}
      imageAlt={imageAlt}
      overlayOpacity={overlayOpacity}
      parallaxSpeed={parallaxSpeed}
      className={cn('py-24', minHeight, className)}
    >
      <div className="flex items-center justify-center h-full">
        <Container maxWidth={contentMaxWidth} className={alignmentClasses[contentAlign]} padding="lg">
          <div className="space-y-6 text-white">
            {title && (
              <Typography
                variant="h2"
                                textShadow
                align={contentAlign}
              >
                {title === 'SIGNATURE CHARM' && translations?.acf?.home_p4 ? (
                  <span dangerouslySetInnerHTML={{ __html: translations.acf.home_p4.replace(/\\r\\n/g, '<br />') }} />
                ) : (
                  title
                )}
              </Typography>
            )}
            
            {subtitle && (
              <Typography
                variant="body"
                                className="text-gray-300"
                align={contentAlign}
              >
                {title === 'SIGNATURE CHARM' && translations?.acf?.home_p6 ? (
                  <span dangerouslySetInnerHTML={{ __html: translations.acf.home_p6.replace(/\\r\\n/g, '<br />') }} />
                ) : (
                  subtitle
                )}
              </Typography>
            )}
            
            {content && (
              <div className="mt-8">
                {content}
              </div>
            )}
            
            {ctaButtons && ctaButtons.length > 0 && (
              <div className={cn(
                'mt-10 flex gap-4',
                contentAlign === 'center' && 'justify-center',
                contentAlign === 'left' && 'justify-start',
                contentAlign === 'right' && 'justify-end',
                ctaButtons.length > 1 && 'flex-col md:flex-row'
              )}>
                {ctaButtons.map((button, index) => (
                  <Button
                    key={index}
                    variant={button.variant}
                    size="lg"
                    highlight={button.highlight}
                    onClick={button.onClick}
                  >
                    {title === 'SIGNATURE CHARM' && translations?.acf?.home_p5 ? (
                      <span dangerouslySetInnerHTML={{ __html: translations.acf.home_p5.replace(/\\r\\n/g, '<br />') }} />
                    ) : (
                      button.text
                    )}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </Container>
      </div>
    </ParallaxSection>
  )
}