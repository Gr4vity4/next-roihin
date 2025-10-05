'use client'

import { HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export interface RelatedCrystalProduct {
  id: string
  slug: string
  nameEn: string
  nameTh: string
  image: string
  price: number
  originalPrice: number
}

interface CrystalRelatedProductsProps {
  crystalName: string
  products: RelatedCrystalProduct[]
  locale: string
}

export default function CrystalRelatedProducts({
  crystalName,
  products,
  locale,
}: CrystalRelatedProductsProps) {
  const t = useTranslations('crystalProduct')

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

function ProductCard({ product, locale }: { product: RelatedCrystalProduct; locale: string }) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const t = useTranslations('crystalProduct.actions')

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
    <Link href={`/${locale}/crystal/product/${product.slug}`} className="group block relative">
      <div className="relative">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-lg mb-3">
          <Image
            src={product.image}
            alt={product.nameEn}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 25vw"
          />
        </div>

        {/* Product Info */}
        <div className="text-center">
          <h3 className="text-sm md:text-base text-gray-900 font-medium line-clamp-2 group-hover:text-gray-600 transition-colors mb-2">
            {product.nameTh}
          </h3>
        </div>

        {/* Price and Action Buttons Row */}
        <div className="flex items-start justify-between gap-2">
          {/* Price */}
          <div className="flex flex-col gap-1">
            <span className="text-sm md:text-base font-semibold text-gray-900">
              {product.price.toLocaleString('th-TH')}.-
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through">
                {product.originalPrice.toLocaleString('th-TH')}.-
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
              className="p-2 bg-white hover:bg-gray-50 rounded-full shadow-sm transition-all"
              aria-label={t('addToWishlist')}
            >
              {isWishlisted ? (
                <HeartSolidIcon className="w-5 h-5 text-red-500" />
              ) : (
                <HeartIcon className="w-5 h-5 text-gray-700 hover:text-red-500 transition-colors" />
              )}
            </button>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="p-2 bg-white hover:bg-gray-50 rounded-full shadow-sm transition-all"
              aria-label={t('addToCart')}
            >
              <ShoppingCartIcon className="w-5 h-5 text-gray-700 hover:text-green-600 transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
