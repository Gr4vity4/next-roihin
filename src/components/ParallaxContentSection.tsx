'use client'

import ParallaxSection from './ParallaxSection'
import { Container, Typography } from './ui'
import Button from './Button'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

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
    variant: 'gold' | 'green'
    onClick?: () => void
    href?: string
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
  return (
    <ParallaxSection
      imageUrl={imageUrl}
      imageAlt={imageAlt}
      overlayOpacity={overlayOpacity}
      parallaxSpeed={parallaxSpeed}
      className={cn('py-24', minHeight, className)}
    >
      <div className="flex items-center justify-center px-4 h-full">
        <Container maxWidth={contentMaxWidth} className={alignmentClasses[contentAlign]}>
          <div className="space-y-6 text-white">
            {title && (
              <Typography
                variant="h2"
                fontFamily="playfair"
                textShadow
                align={contentAlign}
              >
                {title}
              </Typography>
            )}
            
            {subtitle && (
              <Typography
                variant="body"
                fontFamily="thai"
                className="text-gray-300"
                align={contentAlign}
              >
                {subtitle}
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
                    onClick={button.onClick}
                  >
                    {button.text}
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