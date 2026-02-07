'use client'

import { useWishlist } from '@/contexts/WishlistContext'
import { useAuth } from '@/contexts/AuthContext'
import { Heart } from 'lucide-react'
import { useEffect, useState } from 'react'
import AuthModal from '@/components/AuthModal'
import { useLocale } from 'next-intl'

interface WishlistButtonProps {
  product: {
    id: number
    slug?: string
    title?: string
    price?: number
    image?: string
    color?: string
    category?: string
  }
  color?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

export default function WishlistButton({
  product,
  color,
  className = '',
  size = 'md',
  showText = false,
}: WishlistButtonProps) {
  const locale = useLocale()
  const isThai = locale === 'th'
  const { toggleItem, isInWishlist, loading, checkFavorite } = useWishlist()
  const { isLoggedIn } = useAuth()
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'sign-in' | 'sign-up'>('sign-in')

  const selectedColor = color || product.color

  useEffect(() => {
    const checkInitialFavorite = async () => {
      if (!loading) {
        // First check local state
        const localState = isInWishlist(product.id, selectedColor)
        
        // Always check server state for the most accurate information
        const serverState = await checkFavorite(product.id, selectedColor)
        
        // Use server state if available, otherwise fall back to local state
        setIsWishlisted(serverState || localState)
      }
    }
    
    checkInitialFavorite()
  }, [checkFavorite, isInWishlist, product.id, selectedColor, loading])

  const handleToggleWishlist = async () => {
    if (isProcessing) return

    // Check if user is logged in before allowing wishlist action
    if (!isLoggedIn) {
      setShowAuthModal(true)
      return
    }

    setIsAnimating(true)
    setIsProcessing(true)

    try {
      const newState = await toggleItem(product.id, selectedColor)
      setIsWishlisted(newState)
    } catch (error) {
      console.error('Failed to toggle wishlist:', error)
    } finally {
      setIsProcessing(false)
      setTimeout(() => {
        setIsAnimating(false)
      }, 300)
    }
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
    <>
      {/*
        Keep localized labels inside the component so reusable buttons adapt to current locale.
      */}
      <button
        onClick={handleToggleWishlist}
        disabled={isProcessing}
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
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
        aria-label={
          isWishlisted
            ? isThai
              ? 'ลบออกจากรายการโปรด'
              : 'Remove from wishlist'
            : isThai
              ? 'เพิ่มลงรายการโปรด'
              : 'Add to wishlist'
        }
        title={
          isWishlisted
            ? isThai
              ? 'ลบออกจากรายการโปรด'
              : 'Remove from wishlist'
            : isThai
              ? 'เพิ่มลงรายการโปรด'
              : 'Add to wishlist'
        }
      >
        <div className={`relative ${isAnimating ? 'animate-ping' : ''}`}>
          <Heart
            className={`
              ${iconSizeClasses[size]}
              transition-colors duration-200 transition-transform
              ${isWishlisted ? 'text-red-500' : 'text-white group-hover:text-red-400'}
              ${isWishlisted && isAnimating ? 'scale-125' : 'scale-100'}
            `}
            fill={isWishlisted ? 'currentColor' : 'none'}
          />
        </div>

        {showText && (
          <span className={`text-sm font-medium ${isWishlisted ? 'text-red-400' : 'text-white'}`}>
            {isWishlisted
              ? isThai
                ? 'บันทึกแล้ว'
                : 'Saved'
              : isThai
                ? 'บันทึก'
                : 'Save'}
          </span>
        )}

        {isAnimating && !showText && (
          <span className="absolute inset-0 rounded-full animate-ping bg-red-400/20"></span>
        )}
      </button>

      {/* Auth Modal for login prompt */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  )
}
