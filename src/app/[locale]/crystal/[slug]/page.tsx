'use client'

import ChatWidget from '@/components/ChatWidget'
import CrystalFAQ from '@/components/crystal/CrystalFAQ'
import CrystalProductDetail from '@/components/crystal/CrystalProductDetail'
import CrystalRelatedProducts from '@/components/crystal/CrystalRelatedProducts'
import NavigationWithSuspense from '@/components/NavigationWithSuspense'
import { Footer } from '@/components/sections'
import { getCrystalBySlug } from '@/lib/api/crystals'
import { getProductsByCrystalId } from '@/lib/api/products'
import type { CrystalProduct } from '@/lib/types/crystal'
import type { Product as StoreProduct } from '@/lib/types/products'
import { notFound, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function CrystalProductPage() {
  const params = useParams()
  const slug = params.slug as string
  const locale = params.locale as string

  // State
  const [product, setProduct] = useState<CrystalProduct | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<StoreProduct[]>([])
  const [isRelatedLoading, setIsRelatedLoading] = useState(false)
  const [relatedError, setRelatedError] = useState<string | null>(null)

  // Fetch crystal product on mount
  useEffect(() => {
    async function fetchProduct() {
      setIsLoading(true)
      setError(null)

      try {
        const crystalData = await getCrystalBySlug(slug, locale as 'en' | 'th')

        if (!crystalData) {
          setError('Product not found')
          setProduct(null)
        } else {
          setProduct(crystalData)
        }
      } catch (err) {
        console.error('Error fetching crystal product:', err)
        setError('Failed to load product')
        setProduct(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [slug, locale])

  useEffect(() => {
    const crystalId = product?.id

    if (!crystalId) {
      setRelatedProducts([])
      return
    }

    let isCancelled = false

    async function fetchRelatedProducts() {
      setIsRelatedLoading(true)
      setRelatedError(null)

      try {
        const related = await getProductsByCrystalId(
          crystalId,
          8,
          locale === 'th' ? 'th' : 'en'
        )

        if (!isCancelled) {
          setRelatedProducts(related)
        }
      } catch (err) {
        console.error('Error fetching related products:', err)
        if (!isCancelled) {
          setRelatedProducts([])
          setRelatedError('Failed to load related products')
        }
      } finally {
        if (!isCancelled) {
          setIsRelatedLoading(false)
        }
      }
    }

    fetchRelatedProducts()

    return () => {
      isCancelled = true
    }
  }, [product?.id, locale])

  // Show loading state
  if (isLoading) {
    return (
      <>
        <NavigationWithSuspense position="static" />
        <main className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-600 text-lg mt-4">Loading crystal...</p>
          </div>
        </main>
        <Footer />
        <ChatWidget />
      </>
    )
  }

  // Show error or not found
  if (error || !product) {
    notFound()
  }

  return (
    <>
      <NavigationWithSuspense position="static" />

      <main className="min-h-screen bg-white">
        <CrystalProductDetail product={product} locale={locale} />

        {relatedError && (
          <div className="container max-w-5xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
            {relatedError}
          </div>
        )}

        {!relatedError && isRelatedLoading && relatedProducts.length === 0 && (
          <div className="container max-w-5xl mx-auto px-4 py-12 flex flex-col items-center text-gray-500 text-sm">
            <div className="inline-block w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mb-4" />
            <span>Loading related products...</span>
          </div>
        )}

        {!relatedError && relatedProducts.length > 0 && (
          <CrystalRelatedProducts
            crystalName={product.title}
            products={relatedProducts}
            locale={locale}
          />
        )}

        <CrystalFAQ
          crystalName={product.title}
          product={product}
          locale={locale}
        />
      </main>

      <Footer />
      <ChatWidget />
    </>
  )
}
