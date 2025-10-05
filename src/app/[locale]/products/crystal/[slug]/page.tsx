'use client'

import ChatWidget from '@/components/ChatWidget'
import NavigationWithSuspense from '@/components/NavigationWithSuspense'
import { Footer } from '@/components/sections'
import { useCart } from '@/contexts/CartContext'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { notFound, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

// Mock product type
interface CrystalProduct {
  id: string
  slug: string
  nameEn: string
  nameTh: string
  price: number
  originalPrice: number
  image: string
  crystalType: string // The crystal type this product belongs to
}

// Mock crystal type data
interface CrystalType {
  slug: string
  nameEn: string
  nameTh: string
}

// Cart item type
interface CartItem {
  id: string
  slug: string
  title: string
  price: number
  image: string
  category: string
}

// Mock crystal types
const MOCK_CRYSTAL_TYPES: Record<string, CrystalType> = {
  howlite: {
    slug: 'howlite',
    nameEn: 'Howlite',
    nameTh: 'โฮไวท์',
  },
  apatite: {
    slug: 'apatite',
    nameEn: 'Apatite',
    nameTh: 'อะพาไทต์',
  },
  amethyst: {
    slug: 'amethyst',
    nameEn: 'Amethyst',
    nameTh: 'อเมทิสต์',
  },
}

// Mock products database - grouped by crystal type
const MOCK_PRODUCTS: CrystalProduct[] = [
  // Howlite products
  {
    id: '1',
    slug: 'howlite-bracelet-1',
    nameEn: 'Howlite Beaded Bracelet',
    nameTh: 'สร้อยข้อมือหินโฮไวท์',
    price: 3890,
    originalPrice: 5490,
    image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=800&h=800&fit=crop',
    crystalType: 'howlite',
  },
  {
    id: '2',
    slug: 'howlite-pendant-1',
    nameEn: 'Howlite Pendant Necklace',
    nameTh: 'สร้อยคอจี้หินโฮไวท์',
    price: 4590,
    originalPrice: 4590,
    image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=800&h=800&fit=crop',
    crystalType: 'howlite',
  },
  {
    id: '3',
    slug: 'howlite-ring-silver',
    nameEn: 'Howlite Silver Ring',
    nameTh: 'แหวนเงินหินโฮไวท์',
    price: 5890,
    originalPrice: 7990,
    image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=800&h=800&fit=crop',
    crystalType: 'howlite',
  },
  {
    id: '4',
    slug: 'howlite-earrings',
    nameEn: 'Howlite Drop Earrings',
    nameTh: 'ต่างหูห้อยหินโฮไวท์',
    price: 3290,
    originalPrice: 3290,
    image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=800&h=800&fit=crop',
    crystalType: 'howlite',
  },
  {
    id: '5',
    slug: 'howlite-charm-bracelet',
    nameEn: 'Howlite Charm Bracelet',
    nameTh: 'สร้อยข้อมือชาร์มหินโฮไวท์',
    price: 4290,
    originalPrice: 5990,
    image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=800&h=800&fit=crop',
    crystalType: 'howlite',
  },
  {
    id: '6',
    slug: 'howlite-anklet',
    nameEn: 'Howlite Anklet',
    nameTh: 'สร้อยข้อเท้าหินโฮไวท์',
    price: 2890,
    originalPrice: 2890,
    image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=800&h=800&fit=crop',
    crystalType: 'howlite',
  },

  // Apatite products
  {
    id: '7',
    slug: 'apatite-ring-1',
    nameEn: 'Apatite Ring',
    nameTh: 'สร้อยข้อมือเม็ดบัวช่า',
    price: 4890,
    originalPrice: 6990,
    image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=800&h=800&fit=crop',
    crystalType: 'apatite',
  },
  {
    id: '8',
    slug: 'apatite-stone-raw',
    nameEn: 'Apatite Raw Stone',
    nameTh: 'หินอะพาไทต์ดิบ',
    price: 6890,
    originalPrice: 6890,
    image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=800&h=800&fit=crop',
    crystalType: 'apatite',
  },
  {
    id: '9',
    slug: 'apatite-bracelet-1',
    nameEn: 'Apatite Bracelet',
    nameTh: 'สร้อยข้อมือหินอะพาไทต์',
    price: 4890,
    originalPrice: 6990,
    image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=800&h=800&fit=crop',
    crystalType: 'apatite',
  },

  // Amethyst products
  {
    id: '10',
    slug: 'amethyst-cluster',
    nameEn: 'Amethyst Cluster',
    nameTh: 'กลุ่มหินอเมทิสต์',
    price: 8900,
    originalPrice: 12900,
    image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=800&h=800&fit=crop',
    crystalType: 'amethyst',
  },
  {
    id: '11',
    slug: 'amethyst-bracelet',
    nameEn: 'Amethyst Beaded Bracelet',
    nameTh: 'สร้อยข้อมือหินอเมทิสต์',
    price: 5490,
    originalPrice: 5490,
    image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=800&h=800&fit=crop',
    crystalType: 'amethyst',
  },
]

export default function CrystalProductsPage() {
  const params = useParams()
  const slug = params.slug as string
  const locale = params.locale as string
  const t = useTranslations('productListing')
  const { addItem } = useCart()

  const [products, setProducts] = useState<CrystalProduct[]>([])
  const [crystalType, setCrystalType] = useState<CrystalType | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch products filtered by crystal type
  useEffect(() => {
    const foundCrystalType = MOCK_CRYSTAL_TYPES[slug]

    if (!foundCrystalType) {
      setIsLoading(false)
      return
    }

    const filteredProducts = MOCK_PRODUCTS.filter((p) => p.crystalType === slug)

    setTimeout(() => {
      setCrystalType(foundCrystalType)
      setProducts(filteredProducts)
      setIsLoading(false)
    }, 500)
  }, [slug])

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

  if (!crystalType) {
    notFound()
  }

  const crystalName = locale === 'th' ? crystalType.nameTh : crystalType.nameEn

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
            <p className="text-gray-600 text-lg">{t('subtitle', { count: products.length })}</p>
          </div>

          {/* Products Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  locale={locale}
                  addToCart={addItem}
                />
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

function ProductCard({
  product,
  locale,
  addToCart,
}: {
  product: CrystalProduct
  locale: string
  addToCart: (item: CartItem) => void
}) {
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const t = useTranslations('productListing')
  const mockupSlug = 'apatite-ring-1'

  const hasDiscount = product.originalPrice > product.price
  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsAddingToCart(true)

    addToCart({
      id: product.id,
      slug: product.slug,
      title: locale === 'th' ? product.nameTh : product.nameEn,
      price: product.price,
      image: product.image,
      category: 'Crystal Product',
    })

    setTimeout(() => {
      setIsAddingToCart(false)
    }, 500)
  }

  return (
    <Link
      href={`/${locale}/products/crystal-detail/${mockupSlug}`}
      className="group block relative"
    >
      <div className="relative">
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold z-10">
            -{discountPercentage}%
          </div>
        )}

        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-lg mb-3">
          <Image
            src={product.image}
            alt={product.nameEn}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 25vw"
          />
        </div>

        {/* Product Info */}
        <div className="text-center mb-3">
          <h3 className="text-sm md:text-base text-gray-900 font-medium line-clamp-2 group-hover:text-gray-600 transition-colors mb-2">
            {locale === 'th' ? product.nameTh : product.nameEn}
          </h3>

          {/* Price */}
          <div className="flex justify-center items-center gap-1">
            <span className="text-sm md:text-base font-semibold text-gray-900">
              ฿{product.price.toLocaleString('th-TH')}
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                ฿{product.originalPrice.toLocaleString('th-TH')}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={t('addToCart')}
          >
            <ShoppingCartIcon className="w-4 h-4" />
            <span className="hidden sm:inline">
              {isAddingToCart ? t('adding') : t('addToCart')}
            </span>
          </button>

          {/* Wishlist Button */}
          {/* <button
            onClick={handleWishlistToggle}
            className="p-2 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg shadow-sm transition-all"
            aria-label={t('addToWishlist')}
          >
            {isInWishlist ? (
              <HeartSolidIcon className="w-5 h-5 text-red-500" />
            ) : (
              <HeartIcon className="w-5 h-5 text-gray-700 hover:text-red-500 transition-colors" />
            )}
          </button> */}
        </div>
      </div>
    </Link>
  )
}
