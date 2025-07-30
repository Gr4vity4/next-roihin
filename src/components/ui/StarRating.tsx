'use client'

import React from 'react'
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
  color = 'text-gold-400',
  showEmpty = true,
  interactive = false,
  onChange,
}: StarRatingProps) {
  const stars = Array.from({ length: maxRating }, (_, i) => i + 1)
  const filledStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0
  const [hoveredRating, setHoveredRating] = React.useState(0)
  
  const handleClick = (value: number) => {
    if (interactive && onChange) {
      onChange(value)
    }
  }
  
  const handleHover = (value: number) => {
    if (interactive) {
      setHoveredRating(value)
    }
  }
  
  return (
    <div className="flex items-center space-x-1" role={interactive ? "radiogroup" : "img"} aria-label={`Rating: ${rating} out of ${maxRating} stars`}>
      {stars.map((value) => {
        const isFilled = hoveredRating ? value <= hoveredRating : value <= filledStars
        const isHalf = !hoveredRating && value === filledStars + 1 && hasHalfStar
        
        return (
          <button
            key={value}
            onClick={() => handleClick(value)}
            onMouseEnter={() => handleHover(value)}
            onMouseLeave={() => setHoveredRating(0)}
            disabled={!interactive}
            className={cn(
              'p-0.5 transition-all',
              'focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-1',
              interactive && 'cursor-pointer hover:scale-110'
            )}
            type="button"
            role={interactive ? "radio" : undefined}
            aria-checked={interactive ? value === rating : undefined}
            aria-label={interactive ? `Rate ${value} out of ${maxRating} stars` : undefined}
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