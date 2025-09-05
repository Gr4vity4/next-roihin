'use client'

import { cn } from '@/lib/utils'
import Button from '../Button'
import { Container, Typography } from '../ui'
import { useTranslations } from '@/contexts/TranslationContext'

interface AboutSectionProps {
  id?: string
  title: string
  subtitle?: string
  content?: string
  ctaButton?: {
    text: string
    variant: 'primary' | 'gold' | 'green' | 'outline' | 'ghost'
    onClick?: () => void
    href?: string
    size?: 'sm' | 'md' | 'lg'
  }
  backgroundColor?: string
  textAlign?: 'left' | 'center' | 'right'
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  className?: string
}

export default function AboutSection({
  id,
  title,
  content,
  ctaButton,
  backgroundColor = 'bg-light-gray',
  textAlign = 'center',
  maxWidth = 'lg',
  className = '',
}: AboutSectionProps) {
  const { translations } = useTranslations()
  
  return (
    <section id={id} className={cn('py-24', backgroundColor, className)}>
      <Container maxWidth={maxWidth}>
        <div
          className={cn(
            textAlign === 'center' && 'text-center',
            textAlign === 'left' && 'text-left',
            textAlign === 'right' && 'text-right',
          )}
        >
          <Typography variant="h3" className="mb-10">
            {translations?.acf?.home_p2 ? (
              <span dangerouslySetInnerHTML={{ __html: translations.acf.home_p2.replace(/\r\n/g, '<br />') }} />
            ) : (
              title
            )}
          </Typography>

          {(content || translations?.acf?.home_p3) && (
            <Typography variant="body" className="text-gray-600">
              {translations?.acf?.home_p3 ? (
                <span dangerouslySetInnerHTML={{ __html: translations.acf.home_p3.replace(/\r\n/g, '<br />') }} />
              ) : (
                content
              )}
            </Typography>
          )}

          {ctaButton && (
            <div className="mt-10">
              <Button
                variant={ctaButton.variant}
                size={ctaButton.size || 'lg'}
                onClick={ctaButton.onClick}
              >
                {ctaButton.text}
              </Button>
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
