import { StarRating, Typography } from './ui'
import { cn } from '@/lib/utils'

interface TestimonialCardProps {
  rating: number
  content: string
  author: {
    name: string
    location: string
    avatar?: string
  }
  variant?: 'dark' | 'light'
  className?: string
}

const variantStyles = {
  dark: 'bg-white/5 backdrop-blur-sm text-white',
  light: 'bg-white shadow-lg text-gray-900',
}

export default function TestimonialCard({
  rating,
  content,
  author,
  variant = 'dark',
  className = '',
}: TestimonialCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg p-8 space-y-4',
        variantStyles[variant],
        className
      )}
    >
      <StarRating 
        rating={rating} 
        size="md" 
        color={variant === 'dark' ? 'text-gold' : 'text-gold'}
      />
      
      <Typography
        variant="body"
        fontFamily="thai"
        className={variant === 'dark' ? 'text-gray-300' : 'text-gray-700'}
      >
        &ldquo;{content}&rdquo;
      </Typography>
      
      <div className={cn(
        'pt-4 border-t',
        variant === 'dark' ? 'border-white/20' : 'border-gray-200'
      )}>
        <Typography variant="body" className="font-semibold">
          {author.name}
        </Typography>
        <Typography 
          variant="caption" 
          fontFamily="thai"
          className={variant === 'dark' ? 'text-gray-400' : 'text-gray-600'}
        >
          {author.location}
        </Typography>
      </div>
    </div>
  )
}