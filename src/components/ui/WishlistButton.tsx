'use client'

import { useWishlist } from '@/contexts/WishlistContext'
import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { useEffect, useState } from 'react'

interface WishlistButtonProps {
  product: {
    id: string
    slug: string
    title: string
    price: number
    image: string
    color?: string
    category?: string
  }
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

export default function WishlistButton({
  product,
  className = '',
  size = 'md',
  showText = false,
}: WishlistButtonProps) {
  const { addItem, removeItem, isInWishlist } = useWishlist()
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setIsWishlisted(isInWishlist(product.id))
  }, [isInWishlist, product.id])

  const handleToggleWishlist = () => {
    setIsAnimating(true)

    if (isWishlisted) {
      removeItem(product.id)
    } else {
      addItem(product)
    }

    setIsWishlisted(!isWishlisted)

    setTimeout(() => {
      setIsAnimating(false)
    }, 300)
  }

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  return (
    <button
      onClick={handleToggleWishlist}
      className={`
        relative group transition-all duration-200
        ${
          showText
            ? 'inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-600 hover:border-white'
            : `${sizeClasses[size]} rounded-full border-2 border-gray-600 hover:border-white flex items-center justify-center`
        }
        ${
          isWishlisted
            ? 'bg-red-500/10 border-red-500 hover:border-red-400'
            : 'bg-black/50 hover:bg-white/10'
        }
        ${className}
      `}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <div className={`relative ${isAnimating ? 'animate-ping' : ''}`}>
        {isWishlisted ? (
          <HeartSolidIcon
            className={`
              ${iconSizeClasses[size]} 
              text-red-500 
              transition-transform duration-200 
              ${isAnimating ? 'scale-125' : 'scale-100'}
            `}
          />
        ) : (
          <HeartIcon
            className={`
              ${iconSizeClasses[size]} 
              text-white 
              group-hover:text-red-400 
              transition-colors duration-200
            `}
          />
        )}
      </div>

      {showText && (
        <span className={`text-sm font-medium ${isWishlisted ? 'text-red-400' : 'text-white'}`}>
          {isWishlisted ? 'บันทึกแล้ว' : 'บันทึก'}
        </span>
      )}

      {/* Ripple effect on click */}
      {isAnimating && !showText && (
        <span className="absolute inset-0 rounded-full animate-ping bg-red-400/20"></span>
      )}
    </button>
  )
}
