'use client'

import Button from '@/components/Button'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'
import { Link } from '@/i18n/navigation'
import type { WishlistItem } from '@/lib/types/wishlist'
import { getProductImageUrl } from '@/lib/utils/image-helper'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const parseColorOptionId = (value: unknown): number | null => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null
  }
  if (typeof value === 'string') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

const findFirstImageUrl = (candidate: unknown): string | null => {
  if (!Array.isArray(candidate)) {
    return null
  }

  for (const entry of candidate) {
    if (typeof entry === 'string') {
      const trimmed = entry.trim()
      if (trimmed) {
        return trimmed
      }
    } else if (entry && typeof entry === 'object') {
      const maybeUrl = (entry as { url?: unknown }).url
      if (typeof maybeUrl === 'string') {
        const trimmed = maybeUrl.trim()
        if (trimmed) {
          return trimmed
        }
      }
    }
  }

  return null
}

const resolveWishlistItemImageUrl = (item: WishlistItem, colorLabel: string | null): string => {
  const colorOptionImage = findFirstImageUrl(item.color_option?.gallery_images)
  if (colorOptionImage) {
    return getProductImageUrl(colorOptionImage)
  }

  const product = item.product
  const colorPrices = product?.acf?.color_prices ?? []

  if (colorPrices.length > 0) {
    const candidateIds = [
      parseColorOptionId(item.product_color_option_id ?? null),
      parseColorOptionId(item.color_option?.id ?? null),
    ]

    const seenIds = new Set<number>()
    for (const id of candidateIds) {
      if (id === null || seenIds.has(id)) {
        continue
      }
      seenIds.add(id)
      const optionById = colorPrices.find(option => parseColorOptionId(option.id ?? null) === id)
      if (optionById) {
        const image = findFirstImageUrl(optionById.gallery_images)
        if (image) {
          return getProductImageUrl(image)
        }
      }
    }

    if (colorLabel) {
      const normalizedColor = colorLabel.trim().toLowerCase()
      const optionByColor = colorPrices.find(option =>
        typeof option.color === 'string' && option.color.trim().toLowerCase() === normalizedColor
      )
      if (optionByColor) {
        const image = findFirstImageUrl(optionByColor.gallery_images)
        if (image) {
          return getProductImageUrl(image)
        }
      }
    }
  }

  const fallbackGalleryImage = findFirstImageUrl(product?.gallery_urls)
  const fallbackImage = product?.featured_image_url ?? fallbackGalleryImage

  return getProductImageUrl(fallbackImage)
}

export default function WishlistPage() {
  const t = useTranslations('member.wishlist')
  const { items, loading, error, removeItem, clearWishlist, refreshWishlist } = useWishlist()
  const { addItem } = useCart()
  const [removingItem, setRemovingItem] = useState<string | null>(null)
  const [clearing, setClearing] = useState(false)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)

  // Refresh wishlist data when page mounts to ensure we have latest data
  useEffect(() => {
    refreshWishlist()
  }, [refreshWishlist])

  const handleRemoveItem = async (itemId: string) => {
    setRemovingItem(itemId)
    try {
      await removeItem(itemId)
    } catch (err) {
      console.error('Failed to remove item:', err)
    } finally {
      setRemovingItem(null)
    }
  }

  const handleClearWishlist = async () => {
    if (!window.confirm(t('confirmClear'))) {
      return
    }

    setClearing(true)
    try {
      await clearWishlist()
    } catch (err) {
      console.error('Failed to clear wishlist:', err)
    } finally {
      setClearing(false)
    }
  }

  const handleAddToCart = (item: WishlistItem) => {
    setAddingToCart(item.id)

    // Prepare cart item data
    const rawCartColor = item.color ?? item.color_option?.color ?? item.price?.selected?.color ?? null
    const cartColorLabel = typeof rawCartColor === 'string'
      ? rawCartColor
      : (rawCartColor !== null && rawCartColor !== undefined ? String(rawCartColor) : null)
    const rawCategory =
      item.product && typeof item.product === 'object'
        ? (item.product as Record<string, unknown>).category
        : undefined
    const productCategory = typeof rawCategory === 'string' ? rawCategory : undefined
    const cartItem = {
      id: item.color ? `${item.product_id}-${item.color}` : String(item.product_id),
      slug: item.product?.slug || `product-${item.product_id}`,
      title: item.product?.title || `Product ${item.product_id}`,
      price: item.display_price
        ?? item.price?.selected?.price
        ?? item.price?.min_price
        ?? 0,
      image: resolveWishlistItemImageUrl(item, cartColorLabel),
      color: cartColorLabel ?? undefined,
      category: productCategory,
    }

    // Add item to cart
    addItem(cartItem)

    // Show success feedback
    setTimeout(() => {
      setAddingToCart(null)
    }, 1000)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto pt-8 font-prompt">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
              <div className="aspect-square bg-gray-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="space-y-2">
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto pt-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <p className="text-red-600">{t('errors.loadFailed', { error })}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto pt-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <p className="text-gray-600">
            {items.length > 0
              ? t('subtitle', { count: items.length })
              : t('subtitleEmpty')
            }
          </p>
        </div>
        {items.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearWishlist}
            disabled={clearing}
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            {clearing ? t('clearing') : t('clearAll')}
          </Button>
        )}
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const isRemoving = removingItem === item.id
            const productName = item.product?.title || `Product ${item.product_id}`
            const productSlug = item.product?.slug || `product-${item.product_id}`
            const displayPrice = item.display_price
              ?? item.price?.selected?.price
              ?? item.price?.min_price
              ?? 0
            const isAvailable = item.is_available !== false
            const rawColorLabel = item.color ?? item.color_option?.color ?? item.price?.selected?.color ?? null
            const colorLabel = typeof rawColorLabel === 'string'
              ? rawColorLabel
              : (rawColorLabel !== null && rawColorLabel !== undefined ? String(rawColorLabel) : null)
            const productImage = resolveWishlistItemImageUrl(item, colorLabel)
            const colorTranslationKey = 'item.color'
            const translatedColor = colorLabel ? t(colorTranslationKey, { color: colorLabel }) : null
            const colorText = translatedColor && translatedColor !== `member.wishlist.${colorTranslationKey}`
              ? translatedColor
              : colorLabel

            return (
              <div
                key={item.id}
                className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-opacity ${
                  isRemoving ? 'opacity-50' : ''
                }`}
              >
                <Link href={`/charmspacer/product/${productSlug}`}>
                  <div className="aspect-square bg-gray-800 relative overflow-hidden group">
                    <Image
                      src={productImage}
                      alt={productName}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {!isAvailable && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-semibold bg-black/70 px-4 py-2 rounded-full">
                          {t('item.outOfStock')}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <Link href={`/charmspacer/product/${productSlug}`}>
                    <h3 className="font-semibold text-gray-900 mb-1 hover:text-[#005635] transition-colors">
                      {productName}
                    </h3>
                  </Link>
                  {colorText && (
                    <p className="text-sm text-gray-600 mb-2">{colorText}</p>
                  )}
                  <p className="text-xl font-bold text-[#005635] mb-3">
                    {formatPrice(displayPrice)}
                  </p>
                  <div className="space-y-2">
                    {isAvailable ? (
                      <Button
                        fullWidth
                        size="sm"
                        onClick={() => handleAddToCart(item)}
                        disabled={addingToCart === item.id}
                        className={addingToCart === item.id ? 'bg-green-600 hover:bg-green-600' : ''}
                      >
                        {addingToCart === item.id ? t('item.addedToCart') : t('item.addToCart')}
                      </Button>
                    ) : (
                      <Button
                        fullWidth
                        size="sm"
                        variant="outline"
                        disabled
                      >
                        {t('item.outOfStock')}
                      </Button>
                    )}
                    <Button
                      fullWidth
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={isRemoving}
                    >
                      {isRemoving ? t('item.removing') : t('item.remove')}
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('empty.title')}</h3>
          <p className="text-gray-500 mb-6">{t('empty.subtitle')}</p>
          <Link href="/charmspacer">
            <Button>{t('empty.browseProducts')}</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
