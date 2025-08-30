'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Container from '@/components/ui/Container'
import Typography from '@/components/ui/Typography'
import { Product, Category } from '@/lib/types/products'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface ProductDetailProps {
  product: Product
  category: Category
}

export default function ProductDetail({ product, category }: ProductDetailProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState(0)

  const allImages = [product.featured_image_url, ...product.gallery_urls].filter(Boolean)
  const colorPrices = product.acf.color_prices || []
  const selectedPrice = colorPrices[selectedColor]?.price

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
              <Link href="/charmspacer" className="text-gray-400 hover:text-white transition-colors">
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
                      selectedImageIndex === index ? 'border-white' : 'border-gray-700 hover:border-gray-500'
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
                <div className="text-gray-300 leading-relaxed space-y-2">
                  {product.acf.description_th && (
                    <p>{product.acf.description_th}</p>
                  )}
                  {product.acf.description_en && (
                    <p className="text-sm italic">{product.acf.description_en}</p>
                  )}
                </div>
              </div>
            )}

            {/* Contact CTA */}
            <div className="border-t border-gray-800 pt-6">
              <Link
                href="https://lin.ee/xyzabc"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                สั่งซื้อผ่าน LINE
              </Link>
              <p className="text-xs text-gray-500 text-center mt-2">
                ติดต่อเราเพื่อสอบถามรายละเอียดเพิ่มเติม
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}