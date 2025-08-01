import { cn } from '@/lib/utils'
import Link from 'next/link'
import Button from '../Button'
import TestimonialCard from '../TestimonialCard'
import { Container, Typography } from '../ui'

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
    text: string
    variant: 'primary' | 'gold' | 'green' | 'outline' | 'ghost'
    onClick?: () => void
    href?: string
  }
  backgroundColor?: string
  textColor?: string
  className?: string
}

const columnClasses = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
}

export default function TestimonialsSection({
  id,
  title,
  subtitle,
  testimonials,
  columns = 2,
  ctaButton,
  backgroundColor = 'bg-black',
  textColor = 'text-white',
  className = '',
}: TestimonialsSectionProps) {
  return (
    <section id={id} className={cn('py-24', backgroundColor, textColor, className)}>
      <Container>
        <Typography
          variant="h2"
          fontFamily="playfair"
          align="center"
          className="mb-4"
          color="primary"
        >
          {title}
        </Typography>

        <Typography variant="h3" fontFamily="thai" align="center" className="mb-16 text-gray-300">
          {subtitle}
        </Typography>

        <div className={cn('grid gap-8 mb-12', columnClasses[columns])}>
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} content={testimonial.content} variant="dark" />
          ))}
        </div>

        {ctaButton && (
          <div className="text-center">
            {ctaButton.href ? (
              <Link href={ctaButton.href}>
                <Button variant={ctaButton.variant} size="lg">
                  {ctaButton.text}
                </Button>
              </Link>
            ) : (
              <Button variant={ctaButton.variant} size="lg" onClick={ctaButton.onClick}>
                {ctaButton.text}
              </Button>
            )}
          </div>
        )}
      </Container>
    </section>
  )
}
