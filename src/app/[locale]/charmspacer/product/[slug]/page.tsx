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

interface ProductPageProps {
  params: Promise<{ slug: string; locale: string }>
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

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const locale = await getLocale() as 'en' | 'th'
  
  let productData
  try {
    productData = await getProductBySlug(slug, true, 6, locale)
  } catch (error) {
    console.error('Failed to fetch product:', error)
    notFound()
  }

  const { product, category, related } = productData

  return (
    <>
      <NavigationWithSuspense position="static" />

      <main className="min-h-screen bg-black">
        <ProductDetail product={product} category={category} language={locale} />
        
        {related && related.length > 0 && (
          <RelatedProducts products={related} />
        )}
      </main>

      <Footer />
      <ChatWidget />
    </>
  )
}
