'use client'

import { useTranslations } from '@/contexts/TranslationContext'
import { cn } from '@/lib/utils'
import { Link } from '@/i18n/navigation'
import Button from '../Button'
import TestimonialCard from '../TestimonialCard'
import { Container, Typography } from '../ui'
import { useTranslations as useNextIntlTranslations } from 'next-intl'

interface TestimonialData {
  id: string
  content: string
  rating?: number
}

interface TestimonialsSectionProps {
  id?: string
  title: string
  subtitle: string
  testimonials: TestimonialData[]
  columns?: 1 | 2 | 3 | 4
  ctaButton?: {
    text?: string
    translationKey?: string
    variant: 'primary' | 'gold' | 'green' | 'outline' | 'ghost'
    onClick?: () => void
    href?: string
  }
  backgroundColor?: string
  textColor?: string
  className?: string
}

export default function TestimonialsSection({
  id,
  title,
  ctaButton,
  backgroundColor = 'bg-black',
  textColor = 'text-white',
  className = '',
}: TestimonialsSectionProps) {
  const { translations } = useTranslations()
  const t = useNextIntlTranslations('common')

  return (
    <section id={id} className={cn('py-24', backgroundColor, textColor, className)}>
      <Container>
        <Typography variant="h2" align="center" className="mb-16" color="primary">
          {translations?.acf?.home_p7 ? (
            <span
              dangerouslySetInnerHTML={{
                __html: translations.acf.home_p7.replace(/\r\n/g, '<br />'),
              }}
            />
          ) : (
            title
          )}
        </Typography>

        {/* Featured Testimonial from translations */}
        {translations?.acf?.home_p8 && (
          <div className="mb-12">
            <div className="max-w-4xl mx-auto">
              <TestimonialCard
                content={translations.acf.home_p8}
                variant="dark"
                enableHtml={true}
              />
            </div>
          </div>
        )}

        {ctaButton && (
          <div className="text-center">
            {ctaButton.href ? (
              <Link href={ctaButton.href}>
                <Button variant={ctaButton.variant} size="lg">
                  {ctaButton.translationKey ? t(ctaButton.translationKey) : ctaButton.text}
                </Button>
              </Link>
            ) : (
              <Button variant={ctaButton.variant} size="lg" onClick={ctaButton.onClick}>
                {ctaButton.translationKey ? t(ctaButton.translationKey) : ctaButton.text}
              </Button>
            )}
          </div>
        )}
      </Container>
    </section>
  )
}
