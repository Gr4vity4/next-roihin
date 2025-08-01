'use client'

import React from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'gold' | 'light' | 'dark'
  showEmpty?: boolean
  interactive?: boolean
  onChange?: (rating: number) => void
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
}

const variantClasses = {
  gold: {
    filled: 'text-gold-400 fill-gold-400',
    empty: 'text-gold-200 opacity-40',
    hover: 'hover:text-gold-500 hover:fill-gold-500',
  },
  light: {
    filled: 'text-gold-400 fill-gold-400',
    empty: 'text-gray-300 opacity-40',
    hover: 'hover:text-gold-500 hover:fill-gold-500',
  },
  dark: {
    filled: 'text-gold-300 fill-gold-300',
    empty: 'text-gray-500 opacity-40',
    hover: 'hover:text-gold-400 hover:fill-gold-400',
  },
}

export default function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  variant = 'gold',
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
  
  const variantStyles = variantClasses[variant]
  
  return (
    <div className="flex items-center space-x-1" role={interactive ? "radiogroup" : "img"} aria-label={`Rating: ${rating} out of ${maxRating} stars`}>
      {stars.map((value) => {
        const isFilled = hoveredRating ? value <= hoveredRating : value <= filledStars
        const isHalf = !hoveredRating && value === filledStars + 1 && hasHalfStar
        const isEmpty = !isFilled && !isHalf
        
        return (
          <button
            key={value}
            onClick={() => handleClick(value)}
            onMouseEnter={() => handleHover(value)}
            onMouseLeave={() => setHoveredRating(0)}
            disabled={!interactive}
            className={cn(
              'p-0.5 transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-1 focus:ring-offset-transparent',
              interactive ? cn('cursor-pointer hover:scale-110', variantStyles.hover) : 'cursor-default'
            )}
            type="button"
            role={interactive ? "radio" : undefined}
            aria-checked={interactive ? value === rating : undefined}
            aria-label={interactive ? `Rate ${value} out of ${maxRating} stars` : undefined}
          >
            <Star
              className={cn(
                sizeClasses[size],
                'transition-colors duration-200',
                isFilled && variantStyles.filled,
                isHalf && cn(variantStyles.filled, 'opacity-50'),
                isEmpty && showEmpty && variantStyles.empty,
                isEmpty && !showEmpty && 'opacity-0'
              )}
            />
          </button>
        )
      })}
    </div>
  )
}