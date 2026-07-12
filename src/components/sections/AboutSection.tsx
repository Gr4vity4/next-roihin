'use client'

import { cn } from '@/lib/utils'
import { Link } from '@/i18n/navigation'
import Button from '../Button'
import { Container, Typography } from '../ui'
import { useTranslations } from 'next-intl'

interface AboutSectionProps {
  id?: string
  ctaButton?: {
    text?: string
    translationKey?: string
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
  ctaButton,
  backgroundColor = 'bg-light-gray',
  textAlign = 'center',
  maxWidth = 'lg',
  className = '',
}: AboutSectionProps) {
  const t = useTranslations()

  const buttonText = ctaButton?.translationKey ? t(`common.${ctaButton.translationKey}`) : ctaButton?.text

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
          <Typography variant="h3" className="mb-4">
            {t('homePage.about.title')}
          </Typography>

          <Typography variant="h4" className="mb-10 text-gray-700">
            {t('homePage.about.subtitle')}
          </Typography>

          <Typography variant="body" className="text-gray-600 whitespace-pre-line">
            {t('homePage.about.content')}
          </Typography>

          {ctaButton && (
            <div className="mt-10">
              {ctaButton.href ? (
                <Link href={ctaButton.href}>
                  <Button variant={ctaButton.variant} size={ctaButton.size || 'lg'}>
                    {buttonText}
                  </Button>
                </Link>
              ) : (
                <Button
                  variant={ctaButton.variant}
                  size={ctaButton.size || 'lg'}
                  onClick={ctaButton.onClick}
                >
                  {buttonText}
                </Button>
              )}
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
