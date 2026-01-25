import { getProductImageUrl } from '@/lib/utils/image-helper'
import Image from 'next/image'
import Link from 'next/link'

interface Product {
  id: string
  slug: string
  title: string
  featured_image_url: string
  price: number
}

interface ProductGridProps {
  products: Product[]
  currentLocale: string
}

export default function ProductGrid({ products, currentLocale }: ProductGridProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/${currentLocale}/charmspacer/product/${product.slug}`}
          className="group block"
        >
          <div className="relative aspect-square overflow-hidden bg-gray-800 rounded-lg">
            <Image
              src={getProductImageUrl(product.featured_image_url)}
              alt={product.title}
              fill
              className="object-contain group-hover:scale-110 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
          <div className="mt-3 text-center">
            <h3 className="text-sm md:text-base text-white font-light">
              {product.title}
            </h3>
            <p className="mt-1 text-sm md:text-base text-gray-400 font-prompt">
              {formatPrice(product.price)}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}