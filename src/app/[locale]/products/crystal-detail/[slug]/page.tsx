'use client'

import ChatWidget from '@/components/ChatWidget'
import NavigationWithSuspense from '@/components/NavigationWithSuspense'
import { Footer } from '@/components/sections'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  HeartIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { notFound, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

// Mock product type
interface CrystalProductDetail {
  id: string
  slug: string
  nameEn: string
  nameTh: string
  descriptionEn: string
  descriptionTh: string
  price: number
  originalPrice: number
  images: string[]
  crystalTags: string[]
}

// Mock product data
const MOCK_PRODUCTS: CrystalProductDetail[] = [
  {
    id: '1',
    slug: 'apatite-ring-1',
    nameEn: 'Apatite Ring',
    nameTh: 'สร้อยข้อมือเม็ดบัวช่า',
    descriptionEn:
      'Beautiful handcrafted apatite ring. Blue apatite is known for its manifestation properties and ability to enhance creativity. This stunning piece features high-quality apatite stones set in sterling silver.',
    descriptionTh:
      'แหวนหินอะพาไทต์ทำมือที่สวยงาม หินอะพาไทต์สีน้ำเงินเป็นที่รู้จักในด้านคุณสมบัติการสร้างสรรค์และเพิ่มพลังความคิดสร้างสรรค์ ชิ้นงานที่น่าทึ่งนี้มีหินอะพาไทต์คุณภาพสูงฝังในเงินสเตอร์ลิง',
    price: 4890,
    originalPrice: 6990,
    images: [
      'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=800&h=800&fit=crop',
    ],
    crystalTags: ['Apatite', 'Manifestation', 'Creativity', 'Throat Chakra'],
  },
  {
    id: '2',
    slug: 'apatite-stone-raw',
    nameEn: 'Apatite Raw Stone',
    nameTh: 'หินอะพาไทต์ดิบ',
    descriptionEn:
      'Natural raw apatite stone specimen. Perfect for collectors and crystal enthusiasts. This raw piece showcases the natural beauty of blue apatite in its unpolished form.',
    descriptionTh:
      'ตัวอย่างหินอะพาไทต์ดิบธรรมชาติ เหมาะสำหรับนักสะสมและผู้ชื่นชอบคริสตัล ชิ้นดิบนี้แสดงให้เห็นความงามตามธรรมชาติของหินอะพาไทต์สีน้ำเงินในรูปแบบที่ไม่ได้ขัดเงา',
    price: 6890,
    originalPrice: 6890,
    images: [
      'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop',
    ],
    crystalTags: ['Apatite', 'Raw Crystal', 'Natural Specimen'],
  },
  {
    id: '3',
    slug: 'apatite-bracelet-1',
    nameEn: 'Apatite Bracelet',
    nameTh: 'สร้อยข้อมือหินอะพาไทต์',
    descriptionEn:
      'Elegant apatite bead bracelet. Each bead is carefully selected for its vibrant blue color and natural energy. Perfect for daily wear and meditation.',
    descriptionTh:
      'สร้อยข้อมือลูกปัดหินอะพาไทต์ที่หรูหรา ลูกปัดแต่ละเม็ดได้รับการคัดสรรอย่างพิถีพิถันเพื่อสีน้ำเงินที่สดใสและพลังงานธรรมชาติ เหมาะสำหรับการสวมใส่ประจำวันและการทำสมาธิ',
    price: 4890,
    originalPrice: 6990,
    images: [
      'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop',
    ],
    crystalTags: ['Apatite', 'Bracelet', 'Meditation', 'Energy'],
  },
]

export default function CrystalProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const locale = params.locale as string
  const t = useTranslations('productDetail')
  const { addItem } = useCart()
  const { toggleItem, isInWishlist } = useWishlist()

  const [product, setProduct] = useState<CrystalProductDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  // Fetch product
  useEffect(() => {
    const foundProduct = MOCK_PRODUCTS.find((p) => p.slug === slug)

    setTimeout(() => {
      setProduct(foundProduct || null)
      setIsLoading(false)
    }, 500)
  }, [slug])

  const handlePrevImage = () => {
    if (product) {
      setSelectedImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))
    }
  }

  const handleNextImage = () => {
    if (product) {
      setSelectedImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))
    }
  }

  const handleAddToCart = () => {
    if (!product) return

    setIsAddingToCart(true)

    addItem({
      id: product.id,
      slug: product.slug,
      title: locale === 'th' ? product.nameTh : product.nameEn,
      price: product.price,
      image: product.images[0],
      category: 'Crystal Product',
    })

    setTimeout(() => {
      setIsAddingToCart(false)
    }, 500)
  }

  const handleWishlistToggle = async () => {
    if (!product) return

    try {
      await toggleItem(parseInt(product.id))
    } catch (error) {
      console.error('Failed to toggle wishlist:', error)
    }
  }

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

  if (!product) {
    notFound()
  }

  const isInFavorites = isInWishlist(parseInt(product.id))
  const hasDiscount = product.originalPrice > product.price

  return (
    <>
      <NavigationWithSuspense position="static" />

      <main className="min-h-screen bg-white">
        <div className="container max-w-6xl mx-auto px-4 py-8 md:py-12">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-gray-50 overflow-hidden rounded-lg">
                <Image
                  src={product.images[selectedImageIndex]}
                  alt={product.nameEn}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-2 rounded-full transition-colors shadow-lg"
                      aria-label="Previous image"
                    >
                      <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-2 rounded-full transition-colors shadow-lg"
                      aria-label="Next image"
                    >
                      <ChevronRightIcon className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative flex-shrink-0 w-20 h-20 bg-gray-50 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImageIndex === index
                          ? 'border-green-600'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.nameEn} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Title */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {locale === 'th' ? product.nameTh : product.nameEn}
                </h1>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  ฿{product.price.toLocaleString('th-TH')}
                </span>
                {hasDiscount && (
                  <span className="text-xl text-gray-400 line-through">
                    ฿{product.originalPrice.toLocaleString('th-TH')}
                  </span>
                )}
                {hasDiscount && (
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                    -
                    {Math.round(
                      ((product.originalPrice - product.price) / product.originalPrice) * 100,
                    )}
                    %
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('description')}</h2>
                <p className="text-gray-600 leading-relaxed">
                  {locale === 'th' ? product.descriptionTh : product.descriptionEn}
                </p>
              </div>

              {/* Crystal Tags */}
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('crystalTags')}</h2>
                <div className="flex flex-wrap gap-2">
                  {product.crystalTags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-gray-200 pt-6 space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCartIcon className="w-5 h-5" />
                  {isAddingToCart ? t('adding') : t('addToCart')}
                </button>

                <button
                  onClick={handleWishlistToggle}
                  className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-900 py-4 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  {isInFavorites ? (
                    <>
                      <HeartSolidIcon className="w-5 h-5 text-red-500" />
                      {t('removeFromWishlist')}
                    </>
                  ) : (
                    <>
                      <HeartIcon className="w-5 h-5" />
                      {t('addToWishlist')}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <ChatWidget />
    </>
  )
}
