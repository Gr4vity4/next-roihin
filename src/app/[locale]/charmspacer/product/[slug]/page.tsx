import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import NavigationWithSuspense from '@/components/NavigationWithSuspense'
import ChatWidget from '@/components/ChatWidget'
import { Footer } from '@/components/sections'
import ProductDetail from '@/components/sections/ProductDetail'
import RelatedProducts from '@/components/sections/RelatedProducts'
import { getProductBySlug } from '@/lib/api/products'
import { getShopCollection } from '@/config/shop.config'
import type { Product } from '@/lib/types/products'
import { getLocale, getTranslations } from 'next-intl/server'

export const revalidate = 0

interface ProductPageProps {
  params: Promise<{ slug: string; locale: string }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const locale = await getLocale() as 'en' | 'th'
  
  try {
    const { product } = await getProductBySlug(slug, false, 6, locale)
    
    return {
      title: `${product.title} | Roihin Thailand`,
      description: product.excerpt || product.acf.description_th || product.acf.description_en || '',
      openGraph: {
        title: product.title,
        description: product.excerpt || product.acf.description_th || product.acf.description_en || '',
        images: product.featured_image_url ? [product.featured_image_url] : [],
      },
    }
  } catch {
    return {
      title: 'Product Not Found | Roihin Thailand',
      description: 'The requested product could not be found.',
    }
  }
}

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  const { slug } = await params
  const locale = await getLocale() as 'en' | 'th'

  const resolvedSearchParams = searchParams ? await searchParams : undefined
  const rawFrom = resolvedSearchParams?.from
  const from =
    typeof rawFrom === 'string' &&
    (rawFrom === 'new-arrivals' || getShopCollection(rawFrom))
      ? rawFrom
      : undefined

  let productData
  try {
    productData = await getProductBySlug(slug, true, 6, locale)
  } catch (error) {
    console.error('Failed to fetch product:', error)
    notFound()
  }

  const { product, category, related } = productData

  let breadcrumb: { href: string; label: string }[] | undefined
  let relatedBuildHref: ((relatedProduct: Product) => string) | undefined

  if (from) {
    const [tNav, tShop] = await Promise.all([
      getTranslations({ locale, namespace: 'navigation' }),
      getTranslations({ locale, namespace: 'shop' }),
    ])

    breadcrumb = [
      { href: '/shop', label: tNav('shop') },
      {
        href: `/shop/${from}`,
        label:
          from === 'new-arrivals'
            ? tShop('newArrivals.title')
            : tShop(`categories.${from}.title`),
      },
    ]
    relatedBuildHref = (relatedProduct) =>
      `/shop/product/${relatedProduct.slug}?from=${from}`
  }

  return (
    <>
      <NavigationWithSuspense position="static" />

      <main className="min-h-screen bg-black">
        <ProductDetail
          product={product}
          category={category}
          language={locale}
          breadcrumb={breadcrumb}
          showSpecs={false}
        />

        {related && related.length > 0 && (
          <RelatedProducts
            products={related}
            locale={locale}
            buildHref={relatedBuildHref}
          />
        )}
      </main>

      <Footer />
      <ChatWidget />
    </>
  )
}
