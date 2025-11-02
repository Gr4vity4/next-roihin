'use client'

import Container from '@/components/ui/Container'
import Typography from '@/components/ui/Typography'
import WishlistButton from '@/components/ui/WishlistButton'
import { useCart } from '@/contexts/CartContext'
import { Category, Product } from '@/lib/types/products'
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import { Link, useRouter } from '@/i18n/navigation'
import { useState, useEffect } from 'react'
import { getProductImageUrl } from '@/lib/utils/image-helper'

interface ProductDetailProps {
  product: Product
  category: Category
  language?: 'en' | 'th'
}

export default function ProductDetail({ product, category, language = 'en' }: ProductDetailProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState(0)
  const [isAdding, setIsAdding] = useState(false)
  const router = useRouter()
  const { addItem } = useCart()

  const colorPrices = product.acf.color_prices || []
  const hasColorOptions = colorPrices.length > 0
  const multipleColorOptions = colorPrices.length > 1
  const selectedPrice = colorPrices[selectedColor]?.price
  const selectedColorData = colorPrices[selectedColor]
  const colorLabel =
    language === 'th'
      ? multipleColorOptions
        ? 'เลือกสี:'
        : 'สี:'
      : multipleColorOptions
        ? 'Select Color:'
        : 'Color:'

  // Build gallery images based on selected color
  const allImages = (() => {
    const selectedColorGallery = selectedColorData?.gallery_images || []

    // If selected color has gallery images, use only those
    if (selectedColorGallery.length > 0) {
      return selectedColorGallery.map(url => getProductImageUrl(url))
    }

    // Fallback to featured image and general gallery_urls
    return [product.featured_image_url, ...product.gallery_urls]
      .filter(Boolean)
      .map(url => getProductImageUrl(url))
  })()

  // Reset image index when color changes
  useEffect(() => {
    setSelectedImageIndex(0)
  }, [selectedColor])

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))
  }

  return (
    <section className="pt-12 pb-12 md:pt-16 md:pb-16">
      <Container>
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link
                href="/charmspacer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                {language === 'th' ? 'ชาร์ม/สเปเซอร์' : 'Charm/Spacer'}
              </Link>
            </li>
            <li className="text-gray-600">/</li>
            <li>
              <Link
                href={`/charmspacer#${category.slug}`}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {language === 'th'
                  ? category.name_th || category.name_en
                  : category.name_en || category.name_th}
              </Link>
            </li>
            <li className="text-gray-600">/</li>
            <li className="text-white">{product.title}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-800 overflow-hidden">
              {allImages.length > 0 && (
                <>
                  <Image
                    src={allImages[selectedImageIndex]}
                    alt={product.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />

                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-square bg-gray-900 overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index
                        ? 'border-white'
                        : 'border-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.title} thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 25vw, 100px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <Typography variant="h2" className="text-3xl md:text-4xl text-white mb-2">
                    {product.title}
                  </Typography>
                  <p className="text-gray-400 text-sm">
                    {language === 'th' ? 'หมวดหมู่: ' : 'Category: '}
                    {language === 'th'
                      ? category.name_th || category.name_en
                      : category.name_en || category.name_th}
                  </p>
                </div>
                <WishlistButton
                  product={{
                    id: product.id,
                    slug: product.slug,
                    title: product.title,
                    price: selectedPrice || 0,
                    image: allImages[0] || '/images/placeholder.jpg',
                    category:
                      language === 'th'
                        ? category.name_th || category.name_en
                        : category.name_en || category.name_th,
                  }}
                  color={selectedColorData?.color}
                  size="lg"
                />
              </div>
            </div>

            {/* Price and Color Selection */}
            {hasColorOptions && (
              <div className="space-y-4">
                <div>
                  <Typography variant="h3" className="text-2xl text-white font-prompt">
                    ฿{selectedPrice?.toLocaleString('th-TH') || '0'}
                  </Typography>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-3">{colorLabel}</label>
                  <div className="flex flex-wrap gap-2">
                    {colorPrices.map((colorPrice, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedColor(index)}
                        disabled={!colorPrice.available}
                        className={`px-4 py-2 border rounded-lg transition-all ${
                          selectedColor === index
                            ? 'border-white bg-white/10 text-white'
                            : colorPrice.available
                            ? 'border-gray-600 text-gray-300 hover:border-gray-400'
                            : 'border-gray-800 text-gray-600 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {colorPrice.color_icon?.url && (
                            <div className="relative w-8 h-8 overflow-hidden rounded-md bg-black/20">
                              <Image
                                src={colorPrice.color_icon.url}
                                alt={colorPrice.color}
                                fill
                                className="object-cover"
                                sizes="32px"
                              />
                            </div>
                          )}
                          <span className="capitalize">{colorPrice.color}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Product Details */}
            <div className="space-y-4 border-t border-gray-800 pt-6">
              {product.acf.material && (
                <div>
                  <h3 className="text-sm text-gray-400 mb-1">
                    {language === 'th' ? 'วัสดุ:' : 'Material:'}
                  </h3>
                  <p className="text-white font-prompt">{product.acf.material}</p>
                </div>
              )}

              {product.acf.dimensions && (
                <div>
                  <h3 className="text-sm text-gray-400 mb-1">
                    {language === 'th' ? 'ขนาด:' : 'Dimensions:'}
                  </h3>
                  <p className="text-white font-prompt">{product.acf.dimensions}</p>
                </div>
              )}
            </div>

            {/* Description */}
            {(product.acf.description_th || product.acf.description_en) && (
              <div className="space-y-4 border-t border-gray-800 pt-6">
                <h3 className="text-lg text-white font-medium">
                  {language === 'th' ? 'รายละเอียดสินค้า' : 'Product Details'}
                </h3>
                <div className="text-gray-300 leading-relaxed">
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        language === 'th'
                          ? product.acf.description_th || product.acf.description_en || ''
                          : product.acf.description_en || product.acf.description_th || '',
                    }}
                    className="prose prose-invert prose-sm max-w-none"
                  />
                </div>
              </div>
            )}

            {/* Add to Cart CTA */}
            <div className="border-t border-gray-800 pt-6 space-y-3">
              <button
                onClick={() => {
                  if (selectedPrice && selectedColorData) {
                    setIsAdding(true)
                    addItem({
                      id: `${product.id}-${selectedColorData.color}`,
                      slug: product.slug,
                      title: product.title,
                      price: selectedPrice,
                      image: allImages[0] || '/images/placeholder.jpg',
                      color: selectedColorData.color,
                      category:
                        language === 'th'
                          ? category.name_th || category.name_en
                          : category.name_en || category.name_th,
                    })
                    setTimeout(() => {
                      setIsAdding(false)
                    }, 500)
                  }
                }}
                disabled={!selectedPrice || !selectedColorData?.available || isAdding}
                className={`inline-flex items-center justify-center w-full px-6 py-3 font-medium rounded-md transition-all ${
                  !selectedPrice || !selectedColorData?.available
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : isAdding
                    ? 'bg-green-600 text-white'
                    : 'bg-white hover:bg-gray-100 text-black'
                }`}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {isAdding
                  ? language === 'th'
                    ? 'เพิ่มลงตะกร้าแล้ว!'
                    : 'Added to Cart!'
                  : language === 'th'
                  ? 'เพิ่มลงตะกร้า'
                  : 'Add to Cart'}
              </button>

              <button
                onClick={() => {
                  if (selectedPrice && selectedColorData) {
                    addItem({
                      id: `${product.id}-${selectedColorData.color}`,
                      slug: product.slug,
                      title: product.title,
                      price: selectedPrice,
                      image: allImages[0] || '/images/placeholder.jpg',
                      color: selectedColorData.color,
                      category:
                        language === 'th'
                          ? category.name_th || category.name_en
                          : category.name_en || category.name_th,
                    })
                    router.push('/checkout')
                  }
                }}
                disabled={!selectedPrice || !selectedColorData?.available}
                className={`inline-flex items-center justify-center w-full px-6 py-3 font-medium rounded-lg transition-colors ${
                  !selectedPrice || !selectedColorData?.available
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                    : 'bg-transparent border border-gold text-gold hover:bg-gold hover:text-black'
                }`}
              >
                {language === 'th' ? 'ซื้อเลย' : 'Buy Now'}
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
