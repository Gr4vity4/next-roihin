import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { getProductImageUrl } from '@/lib/utils/image-helper'
import type { Product } from '@/lib/types/products'
import { cn } from '@/lib/utils'

interface ShopProductCardProps {
  product: Product
  locale: string
  newLabel: string
}

function formatPrice(price: number, locale: string) {
  const formatter = new Intl.NumberFormat(locale === 'th' ? 'th-TH' : 'en-US', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

  return formatter.format(price)
}

function findStartingPrice(product: Product) {
  if (!product.acf?.color_prices || product.acf.color_prices.length === 0) {
    return null
  }

  const prices = product.acf.color_prices
    .map((option) => option.price)
    .filter((price): price is number => typeof price === 'number')

  if (prices.length === 0) {
    return null
  }

  return Math.min(...prices)
}

export default function ShopProductCard({ product, locale, newLabel }: ShopProductCardProps) {
  const isThai = locale === 'th'
  const price = findStartingPrice(product)
  const imageUrl = getProductImageUrl(product.featured_image_url)

  return (
    <Link
      href={`/shop/product/${product.slug}`}
      className="group rounded-3xl border border-white/10 bg-white/5 backdrop-blur hover:border-gold/70 transition-colors overflow-hidden flex flex-col"
    >
      <div className="relative aspect-square bg-black/40">
        {product.is_arrival && (
          <span className="absolute top-4 left-4 z-10 inline-flex items-center rounded-full bg-gold/90 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-black shadow-lg">
            {newLabel}
          </span>
        )}
        <Image
          src={imageUrl}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <p className="text-xs uppercase tracking-[0.2em] text-gold/80">
          {product.product_category?.name || '—'}
        </p>
        <h3 className="mt-2 text-lg font-light text-white group-hover:text-gold transition-colors">
          {product.title}
        </h3>
        {price !== null && (
          <p className="mt-4 text-sm text-white/70">
            {formatPrice(price, locale)}
          </p>
        )}
        <span className="mt-auto inline-flex items-center gap-2 pt-6 text-xs uppercase tracking-[0.3em] text-white/60">
          <span>{isThai ? 'ดูสินค้า' : 'VIEW'}</span>
          <span
            className={cn(
              'inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/30 text-[10px]',
              'transition-colors group-hover:border-gold group-hover:text-gold'
            )}
          >
            <ArrowRight className="h-3 w-3" aria-hidden />
          </span>
        </span>
      </div>
    </Link>
  )
}
