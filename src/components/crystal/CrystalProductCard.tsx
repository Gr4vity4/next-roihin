'use client'

import { Heart, ShoppingCart } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import AuthModal from '@/components/AuthModal'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'
import type { Product } from '@/lib/types/products'

interface CrystalProductCardProps {
  product: Product
  locale: string
}

export default function CrystalProductCard({ product, locale }: CrystalProductCardProps) {
  const actionsT = useTranslations('crystalProduct.actions')
  const productDetailT = useTranslations('productDetail')
  const { addItem } = useCart()
  const { isLoggedIn } = useAuth()
  const { toggleItem, isInWishlist, loading: wishlistLoading, checkFavorite } =
    useWishlist()

  const [isWishlisted, setIsWishlisted] = useState<boolean>(
    Boolean(product.is_favorite)
  )
  const [isWishlistProcessing, setIsWishlistProcessing] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'sign-in' | 'sign-up'>('sign-in')
  const resetCartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const priceOption =
    product.acf?.color_prices?.find((option) => option.available) ??
    product.acf?.color_prices?.[0]
  const price = typeof priceOption?.price === 'number' ? priceOption.price : null
  const priceLabel =
    price !== null
      ? `฿${price.toLocaleString(locale === 'th' ? 'th-TH' : 'en-US')}`
      : null
  const imageSrc =
    product.featured_image_url ||
    product.gallery_urls?.[0] ||
    '/images/placeholder.jpg'
  const title = product.title || product.slug
  const selectedColor = priceOption?.color
  const canAddToCart =
    price !== null && (priceOption?.available ?? true) && !isNaN(price)
  const cartItemId = `${product.id}-${selectedColor ?? 'default'}`
  // /products/crystal-detail 404s for non-crystal categories; send those
  // (bracelets etc.) to the universal shop product page instead.
  const isCrystalCategory = product.product_category?.slug
    ?.toLowerCase()
    .includes('crystal')
  const detailHref = isCrystalCategory
    ? `/${locale}/products/crystal-detail/${product.slug}`
    : `/${locale}/shop/product/${product.slug}`
  const wishlistLabel = isWishlisted
    ? productDetailT('removeFromWishlist')
    : actionsT('addToWishlist')

  useEffect(() => {
    let isMounted = true

    const synchronizeWishlistState = async () => {
      if (wishlistLoading) {
        return
      }

      const localState = isInWishlist(product.id, selectedColor)

      if (!isLoggedIn) {
        if (isMounted) {
          setIsWishlisted(localState || Boolean(product.is_favorite))
        }
        return
      }

      try {
        const serverState = await checkFavorite(product.id, selectedColor)
        if (isMounted) {
          setIsWishlisted(
            serverState || localState || Boolean(product.is_favorite)
          )
        }
      } catch (error) {
        console.error('Failed to check wishlist state:', error)
        if (isMounted) {
          setIsWishlisted(localState || Boolean(product.is_favorite))
        }
      }
    }

    synchronizeWishlistState()

    return () => {
      isMounted = false
    }
  }, [
    wishlistLoading,
    isInWishlist,
    checkFavorite,
    product.id,
    product.is_favorite,
    selectedColor,
    isLoggedIn,
  ])

  useEffect(() => {
    return () => {
      if (resetCartTimerRef.current) {
        clearTimeout(resetCartTimerRef.current)
        resetCartTimerRef.current = null
      }
    }
  }, [])

  const handleWishlistToggle = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault()
    event.stopPropagation()

    if (isWishlistProcessing) {
      return
    }

    if (!isLoggedIn) {
      setShowAuthModal(true)
      return
    }

    setIsWishlistProcessing(true)

    try {
      const newState = await toggleItem(product.id, selectedColor)
      setIsWishlisted(newState)
    } catch (error) {
      console.error('Failed to toggle wishlist:', error)
    } finally {
      setIsWishlistProcessing(false)
    }
  }

  const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (!canAddToCart || isAddingToCart || price === null) {
      return
    }

    setIsAddingToCart(true)

    try {
      addItem({
        id: cartItemId,
        slug: product.slug,
        title,
        price,
        image: imageSrc,
        color: selectedColor,
        category: product.product_category?.name,
      })

      if (resetCartTimerRef.current) {
        clearTimeout(resetCartTimerRef.current)
      }

      resetCartTimerRef.current = setTimeout(() => {
        setIsAddingToCart(false)
        resetCartTimerRef.current = null
      }, 700)
    } catch (error) {
      console.error('Failed to add item to cart:', error)
      setIsAddingToCart(false)
    }
  }

  return (
    <article className="group block relative">
      <Link href={detailHref} className="block">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-lg mb-3">
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 25vw"
          />
        </div>

        {/* Product Info */}
        <div className="text-center">
          <h3 className="text-sm md:text-base text-gray-900 font-medium line-clamp-2 group-hover:text-gray-600 transition-colors mb-2">
            {title}
          </h3>
        </div>
      </Link>

      {/* Price and Action Buttons Row */}
      <div className="flex items-start justify-between gap-2">
        {/* Price */}
        <div className="flex flex-col gap-1">
          {priceLabel ? (
            <span className="text-sm md:text-base font-semibold text-gray-900">
              {priceLabel}
            </span>
          ) : (
            <span className="text-sm md:text-base font-semibold text-gray-500">
              -
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Wishlist Button */}
          <button
            type="button"
            onClick={handleWishlistToggle}
            disabled={isWishlistProcessing}
            className={`group p-2 rounded-full shadow-sm transition-all ${
              isWishlisted
                ? 'bg-red-50 border border-red-200'
                : 'bg-white hover:bg-gray-50'
            } ${isWishlistProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label={wishlistLabel}
            title={wishlistLabel}
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isWishlisted ? 'text-red-500' : 'text-gray-700 group-hover:text-red-500'
              }`}
              fill={isWishlisted ? 'currentColor' : 'none'}
            />
          </button>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!canAddToCart || isAddingToCart}
            className={`group p-2 rounded-full shadow-sm transition-all ${
              !canAddToCart || isAddingToCart
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white hover:bg-gray-50'
            }`}
            aria-label={actionsT('addToCart')}
            title={actionsT('addToCart')}
          >
            <ShoppingCart
              className={`w-5 h-5 transition-colors ${
                isAddingToCart
                  ? 'text-green-600'
                  : 'text-gray-700 group-hover:text-green-600'
              }`}
            />
          </button>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </article>
  )
}
