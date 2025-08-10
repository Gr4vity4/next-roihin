import { Container, Typography } from '../ui'
import Button from '../Button'
import { cn } from '@/lib/utils'

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
  subtitle,
  content,
  ctaButton,
  backgroundColor = 'bg-light-gray',
  textAlign = 'center',
  maxWidth = 'lg',
  className = '',
}: AboutSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'py-24',
        backgroundColor,
        className
      )}
    >
      <Container maxWidth={maxWidth}>
        <div className={cn(
          textAlign === 'center' && 'text-center',
          textAlign === 'left' && 'text-left',
          textAlign === 'right' && 'text-right'
        )}>
          <Typography
            variant="h3"
            fontFamily="mixed-lang"
            className="mb-4"
          >
            {title}
          </Typography>
          
          {subtitle && (
            <Typography
              variant="body"
              fontFamily="thai"
              className="mb-10 font-light text-gray-700"
            >
              {subtitle}
            </Typography>
          )}
          
          {content && (
            <Typography
              variant="body"
              fontFamily="thai"
              className="text-gray-600"
            >
              {content}
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