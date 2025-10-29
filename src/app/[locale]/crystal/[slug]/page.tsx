'use client'

import ChatWidget from '@/components/ChatWidget'
import CrystalFAQ from '@/components/crystal/CrystalFAQ'
import CrystalProductDetail from '@/components/crystal/CrystalProductDetail'
import CrystalRelatedProducts, {
  RelatedCrystalProduct,
} from '@/components/crystal/CrystalRelatedProducts'
import NavigationWithSuspense from '@/components/NavigationWithSuspense'
import { Footer } from '@/components/sections'
import { getCrystalBySlug } from '@/lib/api/crystals'
import type { CrystalProduct } from '@/lib/types/crystal'
import { notFound, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

// Mock related products data (to be replaced with real API when available)
const MOCK_RELATED_PRODUCTS: RelatedCrystalProduct[] = [
  {
    id: '1',
    slug: 'apatite-ring-1',
    nameEn: 'Apatite Ring',
    nameTh: 'สร้อยข้อมือเม็ดบัวช่า',
    image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=400&h=400&fit=crop',
    price: 4890,
    originalPrice: 6990,
  },
  {
    id: '2',
    slug: 'apatite-stone-raw',
    nameEn: 'Apatite Raw Stone',
    nameTh: 'ทำไสคนคอเลคช่ชั่ "รักนิรันดร์"',
    image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=400&h=400&fit=crop',
    price: 6890,
    originalPrice: 6890,
  },
  {
    id: '3',
    slug: 'apatite-bracelet-1',
    nameEn: 'Apatite Bracelet',
    nameTh: 'สร้อยข้อมือเม็ดบัวช่า',
    image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=400&h=400&fit=crop',
    price: 4890,
    originalPrice: 6990,
  },
  {
    id: '4',
    slug: 'apatite-beads',
    nameEn: 'Apatite Beads',
    nameTh: 'ทำไสคนคอเลคช่ชั่ "รักนิรันดร์"',
    image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=400&h=400&fit=crop',
    price: 6890,
    originalPrice: 6890,
  },
  {
    id: '5',
    slug: 'apatite-pendant-1',
    nameEn: 'Apatite Pendant',
    nameTh: 'สร้อยข้อมือเม็ดบัวช่า',
    image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=400&h=400&fit=crop',
    price: 4890,
    originalPrice: 6990,
  },
  {
    id: '6',
    slug: 'apatite-necklace',
    nameEn: 'Apatite Necklace',
    nameTh: 'ทำไสคนคอเลคช่ชั่ "รักนิรันดร์"',
    image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=400&h=400&fit=crop',
    price: 6890,
    originalPrice: 6890,
  },
  {
    id: '7',
    slug: 'apatite-drop-pendant',
    nameEn: 'Apatite Drop Pendant',
    nameTh: 'สร้อยข้อมือเม็ดบัวช่า',
    image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=400&h=400&fit=crop',
    price: 4890,
    originalPrice: 6990,
  },
  {
    id: '8',
    slug: 'apatite-charm-bracelet',
    nameEn: 'Apatite Charm Bracelet',
    nameTh: 'ทำไสคนคอเลคช่ชั่ "รักนิรันดร์"',
    image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=400&h=400&fit=crop',
    price: 6890,
    originalPrice: 6890,
  },
]

export default function CrystalProductPage() {
  const params = useParams()
  const slug = params.slug as string
  const locale = params.locale as string

  // State
  const [product, setProduct] = useState<CrystalProduct | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

        <CrystalRelatedProducts
          crystalName={product.title}
          products={MOCK_RELATED_PRODUCTS}
          locale={locale}
        />

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
