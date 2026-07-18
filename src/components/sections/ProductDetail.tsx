'use client'

import Container from '@/components/ui/Container'
import Typography from '@/components/ui/Typography'
import WishlistButton from '@/components/ui/WishlistButton'
import { useCart } from '@/contexts/CartContext'
import { Category, Product } from '@/lib/types/products'
import { ChevronDown, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import { Link, useRouter } from '@/i18n/navigation'
import { useId, useState } from 'react'
import { getProductImageUrl } from '@/lib/utils/image-helper'

interface BreadcrumbItem {
  href: string
  label: string
}

interface ProductDetailProps {
  product: Product
  category: Category
  language?: 'en' | 'th'
  breadcrumb?: BreadcrumbItem[]
}

function DetailAccordionItem({ title, content }: { title: string; content: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const contentId = useId()

  return (
    <div className="border-b border-gray-800 last:border-b-0">
      <h3>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-controls={contentId}
          className="flex w-full items-center justify-between gap-4 py-4 text-left group"
        >
          <span className="text-white font-medium group-hover:text-gray-300 transition-colors">
            {title}
          </span>
          <ChevronDown
            className={`w-5 h-5 flex-none text-gray-400 transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      </h3>
      <div
        id={contentId}
        aria-hidden={!isOpen}
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className="pb-4 text-gray-300 leading-relaxed whitespace-pre-line">
            {content}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function ProductDetail({ product, category, language = 'en', breadcrumb }: ProductDetailProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState(0)
  const [selectedColorImageIndex, setSelectedColorImageIndex] = useState(0)
  const [isAdding, setIsAdding] = useState(false)
  const router = useRouter()
  const { addItem } = useCart()

  const pickLocalized = (th?: string, en?: string) => {
    const thai = (th || '').trim()
    const english = (en || '').trim()
    return language === 'th' ? thai || english : english || thai
  }

  const description = pickLocalized(
    product.acf.description_th,
    product.acf.description_en,
  )

  const detailSections = [
    {
      id: 'materials',
      title: language === 'th' ? 'วัสดุ' : 'Materials',
      content: pickLocalized(product.acf.materials_th, product.acf.materials_en),
    },
    {
      id: 'composition',
      title: language === 'th' ? 'ส่วนประกอบ' : 'Composition',
      content: pickLocalized(product.acf.composition_th, product.acf.composition_en),
    },
    {
      id: 'about-this-piece',
      title: language === 'th' ? 'เกี่ยวกับชิ้นงานนี้' : 'About This Piece',
      content: pickLocalized(
        product.acf.about_this_piece_th,
        product.acf.about_this_piece_en,
      ),
    },
    {
      id: 'who-is-this-for',
      title: language === 'th' ? 'เหมาะสำหรับใคร' : 'Who Is This For',
      content: pickLocalized(
        product.acf.who_is_this_for_th,
        product.acf.who_is_this_for_en,
      ),
    },
    {
      id: 'notes',
      title: language === 'th' ? 'หมายเหตุ' : 'Notes',
      content: pickLocalized(product.acf.notes_th, product.acf.notes_en),
    },
    {
      id: 'shipping-options',
      title: language === 'th' ? 'ตัวเลือกการจัดส่ง' : 'Shipping Options',
      content: pickLocalized(
        product.acf.shipping_options_th,
        product.acf.shipping_options_en,
      ),
    },
    {
      id: 'gifting',
      title: language === 'th' ? 'การมอบเป็นของขวัญ' : 'Gifting',
      content: pickLocalized(product.acf.gifting_th, product.acf.gifting_en),
    },
    {
      id: 'sustainability',
      title: language === 'th' ? 'ความยั่งยืน' : 'Sustainability',
      content: pickLocalized(
        product.acf.sustainability_th,
        product.acf.sustainability_en,
      ),
    },
  ].filter((section) => section.content !== '')

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

  // Product gallery (featured + uploaded gallery images)
  const allImages = (() => {
    const rawImages = [product.featured_image_url, ...product.gallery_urls].filter(
      (url): url is string => typeof url === 'string' && url.trim() !== '',
    )

    const resolvedImages = rawImages.map((url) => getProductImageUrl(url))

    if (resolvedImages.length === 0) {
      return [getProductImageUrl('')]
    }

    return Array.from(new Set(resolvedImages))
  })()

  // Selected color preview images (when provided by API)
  const colorPreviewImages = (() => {
    const rawImages = (selectedColorData?.gallery_images || []).filter(
      (url): url is string => typeof url === 'string' && url.trim() !== '',
    )

    if (rawImages.length === 0 && selectedColorData?.color_icon?.url) {
      rawImages.push(selectedColorData.color_icon.url)
    }

    return Array.from(new Set(rawImages.map((url) => getProductImageUrl(url))))
  })()

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))
  }

  const handlePrevColorImage = () => {
    setSelectedColorImageIndex((prev) =>
      prev === 0 ? colorPreviewImages.length - 1 : prev - 1,
    )
  }

  const handleNextColorImage = () => {
    setSelectedColorImageIndex((prev) =>
      prev === colorPreviewImages.length - 1 ? 0 : prev + 1,
    )
  }

  return (
    <section className="pt-12 pb-12 md:pt-16 md:pb-16">
      <Container>
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            {(breadcrumb ?? [
              {
                href: '/charmspacer',
                label: language === 'th' ? 'ชาร์ม/สเปเซอร์' : 'Charm/Spacer',
              },
              {
                href: `/charmspacer#${category.slug}`,
                label:
                  language === 'th'
                    ? category.name_th || category.name_en
                    : category.name_en || category.name_th,
              },
            ]).map((crumb) => (
              <li key={crumb.href} className="flex items-center space-x-2">
                <Link
                  href={crumb.href}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {crumb.label}
                </Link>
                <span className="text-gray-600">/</span>
              </li>
            ))}
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
                        aria-label={language === 'th' ? 'รูปก่อนหน้า' : 'Previous image'}
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                        aria-label={language === 'th' ? 'รูปถัดไป' : 'Next image'}
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
              <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative h-20 w-20 flex-none snap-start bg-gray-900 overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index
                        ? 'border-white'
                        : 'border-gray-700 hover:border-gray-500'
                    }`}
                    aria-label={
                      language === 'th'
                        ? `ดูรูปที่ ${index + 1}`
                        : `View image ${index + 1}`
                    }
                    type="button"
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
                        onClick={() => {
                          setSelectedColor(index)
                          setSelectedColorImageIndex(0)
                        }}
                        disabled={!colorPrice.available}
                        className={`px-4 py-2 border rounded-lg transition-all ${
                          selectedColor === index
                            ? 'border-white bg-white/10 text-white'
                            : colorPrice.available
                            ? 'border-gray-600 text-gray-300 hover:border-gray-400'
                            : 'border-gray-800 text-gray-600 cursor-not-allowed'
                        }`}
                        type="button"
                      >
                        <div className="flex items-center gap-3">
                          {colorPrice.color_icon?.url && (
                            <div className="relative w-8 h-8 overflow-hidden rounded-md bg-black/20">
                              <Image
                                src={getProductImageUrl(colorPrice.color_icon.url)}
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

                  {colorPreviewImages.length > 0 && (
                    <div className="mt-4 space-y-3">
                      <div className="relative aspect-square w-full lg:w-1/2 overflow-hidden rounded-lg border border-gray-800 bg-gray-900">
                        <Image
                          src={colorPreviewImages[selectedColorImageIndex] || getProductImageUrl('')}
                          alt={`${selectedColorData?.color || 'Selected color'} preview`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 25vw"
                        />

                        {colorPreviewImages.length > 1 && (
                          <>
                            <button
                              onClick={handlePrevColorImage}
                              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                              aria-label={
                                language === 'th'
                                  ? 'รูปสีสินค้า ก่อนหน้า'
                                  : 'Previous color image'
                              }
                              type="button"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                              onClick={handleNextColorImage}
                              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                              aria-label={
                                language === 'th'
                                  ? 'รูปสีสินค้า ถัดไป'
                                  : 'Next color image'
                              }
                              type="button"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>
                          </>
                        )}
                      </div>

                      {colorPreviewImages.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory">
                          {colorPreviewImages.map((image, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedColorImageIndex(index)}
                              className={`relative h-16 w-16 flex-none snap-start bg-gray-900 overflow-hidden border-2 transition-colors ${
                                selectedColorImageIndex === index
                                  ? 'border-white'
                                  : 'border-gray-700 hover:border-gray-500'
                              }`}
                              aria-label={
                                language === 'th'
                                  ? `ดูรูปสีสินค้า ${index + 1}`
                                  : `View color image ${index + 1}`
                              }
                              type="button"
                            >
                              <Image
                                src={image}
                                alt={`${product.title} color thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="64px"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
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
            {description !== '' && (
              <div className="space-y-4 border-t border-gray-800 pt-6">
                <h3 className="text-lg text-white font-medium">
                  {language === 'th' ? 'รายละเอียดสินค้า' : 'Product Details'}
                </h3>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {description}
                </p>
              </div>
            )}

            {/* Additional Details (collapsible) */}
            {detailSections.length > 0 && (
              <div className="border-t border-gray-800">
                {detailSections.map((section) => (
                  <DetailAccordionItem
                    key={section.id}
                    title={section.title}
                    content={section.content}
                  />
                ))}
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
