'use client'

import { useTranslations } from 'next-intl'

import CrystalProductCard from '@/components/crystal/CrystalProductCard'
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
            <CrystalProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  )
}
