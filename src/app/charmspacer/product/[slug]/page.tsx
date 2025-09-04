import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navigation from '@/components/Navigation'
import ChatWidget from '@/components/ChatWidget'
import { Footer } from '@/components/sections'
import ProductDetail from '@/components/sections/ProductDetail'
import RelatedProducts from '@/components/sections/RelatedProducts'
import { getProductBySlug } from '@/lib/api/products'
import { cookies } from 'next/headers'

export const revalidate = 900

interface ProductPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ lang?: string }>
}

export async function generateMetadata({ params, searchParams }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const { lang } = await searchParams
  const cookieStore = await cookies()
  const cookieLang = cookieStore.get('site-language')?.value as 'en' | 'th' | undefined
  const language = (lang === 'th' ? 'th' : lang === 'en' ? 'en' : cookieLang || 'en') as 'en' | 'th'
  
  try {
    const { product } = await getProductBySlug(slug, false, 6, language)
    
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
  const { lang } = await searchParams
  const cookieStore = await cookies()
  const cookieLang = cookieStore.get('site-language')?.value as 'en' | 'th' | undefined
  const language = (lang === 'th' ? 'th' : lang === 'en' ? 'en' : cookieLang || 'en') as 'en' | 'th'
  
  let productData
  try {
    productData = await getProductBySlug(slug, true, 6, language)
  } catch (error) {
    console.error('Failed to fetch product:', error)
    notFound()
  }

  const { product, category, related } = productData

  return (
    <>
      <Navigation position="static" />

      <main className="min-h-screen bg-black">
        <ProductDetail product={product} category={category} language={language} />
        
        {related && related.length > 0 && (
          <RelatedProducts products={related} />
        )}
      </main>

      <Footer />
      <ChatWidget />
    </>
  )
}