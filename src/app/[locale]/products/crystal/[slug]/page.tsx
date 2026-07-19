'use client'

import ChatWidget from '@/components/ChatWidget'
import CrystalProductCard from '@/components/crystal/CrystalProductCard'
import NavigationWithSuspense from '@/components/NavigationWithSuspense'
import { Footer } from '@/components/sections'
import { getCrystalBySlug } from '@/lib/api/crystals'
import { getRelatedProductsByCrystalSlug } from '@/lib/api/products'
import type { CrystalProduct } from '@/lib/types/crystal'
import type { Product } from '@/lib/types/products'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { notFound, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function CrystalProductsPage() {
  const params = useParams()
  const slug = params.slug as string
  const locale = params.locale as string
  const t = useTranslations('productListing')

  const [crystal, setCrystal] = useState<CrystalProduct | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [crystalError, setCrystalError] = useState<string | null>(null)
  const [productsError, setProductsError] = useState<string | null>(null)

  // Fetch the crystal by slug, then its related store products
  useEffect(() => {
    let isCancelled = false
    const lang = locale === 'th' ? 'th' : 'en'

    async function fetchCrystalProducts() {
      setIsLoading(true)
      setCrystalError(null)
      setProductsError(null)

      try {
        const crystalData = await getCrystalBySlug(slug, lang)

        if (isCancelled) {
          return
        }

        setCrystal(crystalData)

        if (!crystalData) {
          return
        }

        try {
          // No per_page → the CMS returns every product linked to this crystal
          const crystalProducts = await getRelatedProductsByCrystalSlug(
            slug,
            undefined,
            lang
          )

          if (!isCancelled) {
            setProducts(crystalProducts)
          }
        } catch (err) {
          console.error('Error fetching crystal products:', err)
          if (!isCancelled) {
            setProducts([])
            setProductsError(
              lang === 'th'
                ? 'ไม่สามารถโหลดสินค้าได้ กรุณาลองใหม่อีกครั้ง'
                : 'Failed to load products. Please try again.'
            )
          }
        }
      } catch (err) {
        console.error('Error fetching crystal:', err)
        if (!isCancelled) {
          setCrystal(null)
          setCrystalError(
            lang === 'th'
              ? 'ไม่สามารถโหลดข้อมูลหินได้ กรุณาลองใหม่อีกครั้ง'
              : 'Failed to load crystal. Please try again.'
          )
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchCrystalProducts()

    return () => {
      isCancelled = true
    }
  }, [slug, locale])

  if (isLoading) {
    return (
      <>
        <NavigationWithSuspense position="static" />
        <main className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-600 text-lg mt-4">{t('loading')}</p>
          </div>
        </main>
        <Footer />
        <ChatWidget />
      </>
    )
  }

  if (crystalError) {
    return (
      <>
        <NavigationWithSuspense position="static" />
        <main className="min-h-screen bg-white flex items-center justify-center">
          <p className="text-gray-500 text-lg px-4 text-center">{crystalError}</p>
        </main>
        <Footer />
        <ChatWidget />
      </>
    )
  }

  if (!crystal) {
    notFound()
  }

  const crystalName = crystal.title

  return (
    <>
      <NavigationWithSuspense position="static" />

      <main className="min-h-screen bg-white">
        <div className="container max-w-7xl mx-auto px-4 py-8 md:py-12">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li>
                <Link href={`/${locale}`} className="hover:text-gray-700 transition-colors">
                  {t('breadcrumb.home')}
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href={`/${locale}/crystal`} className="hover:text-gray-700 transition-colors">
                  {t('breadcrumb.crystals')}
                </Link>
              </li>
              <li>/</li>
              <li className="text-gray-900 font-medium">{crystalName}</li>
            </ol>
          </nav>

          {/* Page Header */}
          <div className="mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {t('title', { crystalName })}
            </h1>
            {!productsError && (
              <p className="text-gray-600 text-lg">{t('subtitle', { count: products.length })}</p>
            )}
          </div>

          {/* Products Grid */}
          {productsError ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">{productsError}</p>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <CrystalProductCard key={product.id} product={product} locale={locale} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">{t('noProducts')}</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <ChatWidget />
    </>
  )
}
