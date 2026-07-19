'use client'

import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import type { Testimonial } from '@/lib/types/testimonials'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import Button from '../Button'
import TestimonialCard from '../TestimonialCard'
import TestimonialReviewCard from '../TestimonialReviewCard'
import { Container, Typography } from '../ui'

const RANDOM_COUNT = 2
// Upper bound of the pool the random picks are drawn from (API max per page)
const POOL_SIZE = 100

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

function pickRandom(items: Testimonial[], count: number): Testimonial[] {
  const pool = [...items]
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, count)
}

function TestimonialsSectionLoading() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {Array.from({ length: RANDOM_COUNT }).map((_, index) => (
        <div key={index} className="bg-gray-100 rounded-lg p-4 sm:p-6 animate-pulse">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            <div className="flex gap-4 lg:gap-6 items-start flex-1">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-gray-200"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="mb-2 lg:mb-3">
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 w-full lg:w-auto">
              <div className="w-full lg:w-48 h-48 sm:h-56 lg:h-32 rounded-lg bg-gray-200"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function TestimonialsSection({
  id,
  ctaButton,
  backgroundColor = 'bg-white',
  textColor = 'text-black',
  className = '',
}: TestimonialsSectionProps) {
  const t = useTranslations()
  const locale = useLocale() as 'en' | 'th'
  const [testimonials, setTestimonials] = useState<Testimonial[] | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function fetchTestimonials() {
      try {
        const response = await fetch(
          `/api/testimonials?lang=${locale}&page=1&per_page=${POOL_SIZE}`,
        )

        if (!response.ok) {
          throw new Error(`Failed to fetch testimonials: ${response.status}`)
        }

        const data = await response.json()
        if (!cancelled) {
          setTestimonials(pickRandom(data.testimonials || [], RANDOM_COUNT))
        }
      } catch (err) {
        console.error('Error fetching testimonials:', err)
        if (!cancelled) {
          setFailed(true)
        }
      }
    }

    fetchTestimonials()

    return () => {
      cancelled = true
    }
  }, [locale])

  const showFallback = failed || (testimonials !== null && testimonials.length === 0)

  return (
    <section id={id} className={cn('py-24', backgroundColor, textColor, className)}>
      <Container>
        <Typography variant="h2" align="center" className="mb-16" color="primary">
          {t('homePage.testimonials.title')}
        </Typography>

        {/* Random customer testimonials (same card layout as /testimonial) */}
        <div className="mb-12">
          {showFallback ? (
            <div className="max-w-4xl mx-auto">
              <TestimonialCard
                content={t('homePage.testimonials.content')}
                variant="light"
                enableHtml={false}
              />
            </div>
          ) : testimonials === null ? (
            <TestimonialsSectionLoading />
          ) : (
            <div className="space-y-8 max-w-6xl mx-auto">
              {testimonials.map((testimonial) => (
                <TestimonialReviewCard
                  key={testimonial.id}
                  testimonial={testimonial}
                  variant="light"
                />
              ))}
            </div>
          )}
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
