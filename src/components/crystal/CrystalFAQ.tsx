'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'

interface CrystalFAQProps {
  crystalName: string
  locale: string
}

export default function CrystalFAQ({ crystalName, locale }: CrystalFAQProps) {
  const t = useTranslations('crystalProduct.faq')

  return (
    <section className="bg-white py-12 md:py-16 border-t border-gray-200">
      <div className="container max-w-5xl mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-6 md:gap-8 text-center">
          {/* View All Products Link */}
          <Link
            href={`/${locale}/crystal`}
            className="text-lg md:text-xl text-gray-900 hover:text-gray-600 transition-colors"
          >
            {t('viewAllProducts', { crystalName })}
          </Link>

          {/* Back to Catalog Link */}
          <Link
            href={`/${locale}/crystal`}
            className="text-base md:text-lg text-gray-600 hover:text-gray-900 transition-colors"
          >
            {t('backToCatalog')}
          </Link>
        </div>
      </div>
    </section>
  )
}
