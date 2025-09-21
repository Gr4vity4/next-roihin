'use client'

import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import Button from '../Button'
import TestimonialCard from '../TestimonialCard'
import { Container, Typography } from '../ui'

interface TestimonialsSectionProps {
  id?: string
  title?: string
  content?: string
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
  ctaButton,
  backgroundColor = 'bg-black',
  textColor = 'text-white',
  className = '',
}: TestimonialsSectionProps) {
  const t = useTranslations()

  return (
    <section id={id} className={cn('py-24', backgroundColor, textColor, className)}>
      <Container>
        <Typography variant="h2" align="center" className="mb-16" color="primary">
          {t('homePage.testimonials.title')}
        </Typography>

        {/* Featured Testimonial */}
        <div className="mb-12">
          <div className="max-w-4xl mx-auto">
            <TestimonialCard
              content={t('homePage.testimonials.content')}
              variant="dark"
              enableHtml={false}
            />
          </div>
        </div>

        {ctaButton && (
          <div className="text-center">
            {ctaButton.href ? (
              <Link href={ctaButton.href}>
                <Button variant={ctaButton.variant} size="lg">
                  {ctaButton.translationKey ? t(`common.${ctaButton.translationKey}`) : ctaButton.text}
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
