'use client'

import Container from '@/components/ui/Container'
import Typography from '@/components/ui/Typography'
import { useCart } from '@/contexts/CartContext'
import { Category, Product } from '@/lib/types/products'
import { ChevronLeftIcon, ChevronRightIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface ProductDetailProps {
  product: Product
  category: Category
}

export default function ProductDetail({ product, category }: ProductDetailProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState(0)
  const [isAdding, setIsAdding] = useState(false)
  const router = useRouter()
  const { addItem } = useCart()

  const allImages = [product.featured_image_url, ...product.gallery_urls].filter(Boolean)
  const colorPrices = product.acf.color_prices || []
  const selectedPrice = colorPrices[selectedColor]?.price
  const selectedColorData = colorPrices[selectedColor]

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
                ชาร์ม/สเปเซอร์
              </Link>
            </li>
            <li className="text-gray-600">/</li>
            <li>
              <Link
                href={`/charmspacer#${category.slug}`}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {category.name_th || category.name_en}
              </Link>
            </li>
            <li className="text-gray-600">/</li>
            <li className="text-white">{product.title}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-900 overflow-hidden">
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
                        <ChevronLeftIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                        aria-label="Next image"
                      >
                        <ChevronRightIcon className="w-5 h-5" />
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
            <div>
              <Typography variant="h2" className="text-3xl md:text-4xl text-white mb-2">
                {product.title}
              </Typography>
              <p className="text-gray-400 text-sm">
                หมวดหมู่: {category.name_th || category.name_en}
              </p>
            </div>

            {/* Price and Color Selection */}
            {colorPrices.length > 0 && (
              <div className="space-y-4">
                <div>
                  <Typography variant="h3" className="text-2xl text-white">
                    ฿{selectedPrice?.toLocaleString('th-TH') || '0'}
                  </Typography>
                </div>

                {colorPrices.length > 1 && (
                  <div>
                    <label className="block text-sm text-gray-400 mb-3">เลือกสี:</label>
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
                          <div className="flex items-center gap-2">
                            {colorPrice.color_icon?.url && (
                              <Image
                                src={colorPrice.color_icon.url}
                                alt={colorPrice.color}
                                width={20}
                                height={20}
                                className="rounded-full"
                              />
                            )}
                            <span className="capitalize">{colorPrice.color}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Product Details */}
            <div className="space-y-4 border-t border-gray-800 pt-6">
              {product.acf.material && (
                <div>
                  <h3 className="text-sm text-gray-400 mb-1">วัสดุ:</h3>
                  <p className="text-white">{product.acf.material}</p>
                </div>
              )}

              {product.acf.dimensions && (
                <div>
                  <h3 className="text-sm text-gray-400 mb-1">ขนาด:</h3>
                  <p className="text-white">{product.acf.dimensions}</p>
                </div>
              )}
            </div>

            {/* Description */}
            {(product.acf.description_th || product.acf.description_en) && (
              <div className="space-y-4 border-t border-gray-800 pt-6">
                <h3 className="text-lg text-white font-medium">รายละเอียดสินค้า</h3>
                <div className="text-gray-300 leading-relaxed space-y-4">
                  {product.acf.description_th && (
                    <div
                      dangerouslySetInnerHTML={{ __html: product.acf.description_th }}
                      className="prose prose-invert prose-sm max-w-none"
                    />
                  )}
                  {product.acf.description_en && (
                    <div
                      dangerouslySetInnerHTML={{ __html: product.acf.description_en }}
                      className="text-sm italic prose prose-invert prose-sm max-w-none"
                    />
                  )}
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
                      category: category.name_th || category.name_en,
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
                <ShoppingCartIcon className="w-5 h-5 mr-2" />
                {isAdding ? 'เพิ่มลงตะกร้าแล้ว!' : 'เพิ่มลงตะกร้า'}
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
                      category: category.name_th || category.name_en,
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
                ซื้อเลย
              </button>

              <p className="text-xs text-gray-500 text-center">
                จัดส่งฟรีทั่วประเทศ เมื่อซื้อครบ 1,500 บาท
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
