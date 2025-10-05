'use client'

import type { CrystalProduct } from '@/lib/types/crystal'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

interface CrystalFAQProps {
  crystalName: string
  product: CrystalProduct
  locale: string
}

export default function CrystalFAQ({ crystalName, product, locale }: CrystalFAQProps) {
  const t = useTranslations('crystalProduct.faq')

  return (
    <section className="bg-white py-12 md:pb-16">
      <div className="container max-w-5xl mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
          {/* View All Products Link */}
          <Link
            href={`/${locale}/products/crystal/${product.nameEn.toLocaleLowerCase()}`}
            className="px-6 py-3 text-sm md:text-base text-gray-900 border border-gray-300 hover:border-gray-900 hover:bg-gray-50 transition-all"
          >
            {t('viewAllProducts', { crystalName })}
          </Link>

          {/* Back to Catalog Link */}
          <Link
            href={`/${locale}/crystal`}
            className="px-6 py-3 text-sm md:text-base text-gray-900 border border-gray-300 hover:border-gray-900 hover:bg-gray-50 transition-all"
          >
            {t('backToCatalog')}
          </Link>
        </div>
      </div>
    </section>
  )
}
