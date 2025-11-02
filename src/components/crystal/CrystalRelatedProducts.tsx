'use client'

import { Heart, ShoppingCart } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import type { Product } from '@/lib/types/products'

interface CrystalRelatedProductsProps {
  crystalName: string
  products: Product[]
  locale: string
}

export default function CrystalRelatedProducts({
  crystalName,
  products,
  locale,
}: CrystalRelatedProductsProps) {
  const t = useTranslations('crystalProduct')

  if (!products.length) {
    return null
  }

  return (
    <section className="bg-white py-12 md:py-16 border-t border-gray-200">
      <div className="container max-w-5xl mx-auto px-4">
        {/* Section Title */}
        <h2 className="text-2xl md:text-3xl text-center text-gray-900 mb-8 md:mb-12">
          {t('relatedProducts.title', { crystalName })}
        </h2>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProductCard({ product, locale }: { product: Product; locale: string }) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const t = useTranslations('crystalProduct.actions')
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

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted)
    // In a real implementation, this would call the wishlist API
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    // In a real implementation, this would call the cart API
    console.log('Add to cart:', product.id)
  }

  return (
    <Link
      href={`/${locale}/products/crystal-detail/${product.slug}`}
      className="group block relative"
    >
      <div className="relative">
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
              onClick={(e) => {
                e.preventDefault()
                handleWishlistToggle()
              }}
              className="group p-2 bg-white hover:bg-gray-50 rounded-full shadow-sm transition-all"
              aria-label={t('addToWishlist')}
            >
              {isWishlisted ? (
                <Heart className="w-5 h-5 text-red-500" fill="currentColor" />
              ) : (
                <Heart className="w-5 h-5 text-gray-700 transition-colors group-hover:text-red-500" />
              )}
            </button>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="p-2 bg-white hover:bg-gray-50 rounded-full shadow-sm transition-all"
              aria-label={t('addToCart')}
            >
              <ShoppingCart className="w-5 h-5 text-gray-700 transition-colors hover:text-green-600" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
