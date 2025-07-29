'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  color?: string
  showEmpty?: boolean
  interactive?: boolean
  onChange?: (rating: number) => void
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
}

export default function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  color = 'text-gold',
  showEmpty = true,
  interactive = false,
  onChange,
}: StarRatingProps) {
  const stars = Array.from({ length: maxRating }, (_, i) => i + 1)
  const filledStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0
  
  const handleClick = (value: number) => {
    if (interactive && onChange) {
      onChange(value)
    }
  }
  
  return (
    <div className="flex items-center space-x-1">
      {stars.map((value) => {
        const isFilled = value <= filledStars
        const isHalf = value === filledStars + 1 && hasHalfStar
        
        return (
          <button
            key={value}
            onClick={() => handleClick(value)}
            disabled={!interactive}
            className={cn(
              'focus:outline-none',
              interactive && 'cursor-pointer hover:scale-110 transition-transform'
            )}
            type="button"
          >
            <Star
              className={cn(
                sizeClasses[size],
                color,
                isFilled && 'fill-current',
                isHalf && 'fill-current opacity-50',
                !isFilled && !isHalf && showEmpty && 'opacity-30'
              )}
            />
          </button>
        )
      })}
    </div>
  )
}