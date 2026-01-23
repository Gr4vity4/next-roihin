import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import NavigationWithSuspense from '@/components/NavigationWithSuspense'
import ChatWidget from '@/components/ChatWidget'
import { Footer } from '@/components/sections'
import ProductDetail from '@/components/sections/ProductDetail'
import RelatedProducts from '@/components/sections/RelatedProducts'
import { REVALIDATE_SEMI_STATIC } from '@/config/cache.config'
import { getProductBySlug } from '@/lib/api/products'
import { getLocale } from 'next-intl/server'

export const revalidate = REVALIDATE_SEMI_STATIC

interface CrystalProductPageProps {
  params: Promise<{ slug: string; locale: string }>
}

const isCrystalCategorySlug = (slug?: string) => slug ? slug.toLowerCase().includes('crystal') : false

export async function generateMetadata({ params }: CrystalProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const locale = await getLocale() as 'en' | 'th'

  try {
    const { product, category } = await getProductBySlug(slug, false, 6, locale)

    if (!isCrystalCategorySlug(category.slug)) {
      throw new Error(`Product ${slug} is not a crystal item`)
    }

    const description =
      product.excerpt || product.acf.description_th || product.acf.description_en || ''

    return {
      title: `${product.title} | Roihin Thailand`,
      description,
      openGraph: {
        title: product.title,
        description,
        images: product.featured_image_url ? [product.featured_image_url] : [],
      },
    }
  } catch {
    return {
      title: 'Crystal Product Not Found | Roihin Thailand',
      description: 'The requested crystal product could not be found.',
    }
  }
}

export default async function CrystalProductPage({ params }: CrystalProductPageProps) {
  const { slug } = await params
  const locale = await getLocale() as 'en' | 'th'

  let productData: Awaited<ReturnType<typeof getProductBySlug>> | undefined

  try {
    productData = await getProductBySlug(slug, true, 6, locale)
  } catch (error) {
    console.error('Failed to fetch crystal product:', error)
    notFound()
  }

  if (!productData || !isCrystalCategorySlug(productData.category.slug)) {
    notFound()
  }

  const { product, category, related } = productData

  return (
    <>
      <NavigationWithSuspense position="static" />

      <main className="min-h-screen bg-black">
        <ProductDetail product={product} category={category} language={locale} />

        {related && related.length > 0 && (
          <RelatedProducts
            products={related}
            buildHref={(relatedProduct) => `/products/crystal-detail/${relatedProduct.slug}`}
          />
        )}
      </main>

      <Footer />
      <ChatWidget />
    </>
  )
}
