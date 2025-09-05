import { cn } from '@/lib/utils'
import { Typography } from './ui'

interface TestimonialCardProps {
  content: string
  variant?: 'dark' | 'light'
  className?: string
  enableHtml?: boolean
}

const variantStyles = {
  dark: 'bg-white/5 backdrop-blur-sm text-white',
  light: 'bg-white shadow-lg text-gray-900',
}

export default function TestimonialCard({
  content,
  variant = 'dark',
  className = '',
  enableHtml = false,
}: TestimonialCardProps) {
  return (
    <div className={cn('p-8 space-y-4 rounded-lg', variantStyles[variant], className)}>
      <Typography
        variant="body"
        className={variant === 'dark' ? 'text-gray-300' : 'text-gray-700'}
      >
        {enableHtml ? (
          <span dangerouslySetInnerHTML={{ __html: content.replace(/\r\n/g, '<br />') }} />
        ) : (
          content
        )}
      </Typography>
    </div>
  )
}
