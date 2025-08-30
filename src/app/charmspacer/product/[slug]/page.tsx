import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navigation from '@/components/Navigation'
import ChatWidget from '@/components/ChatWidget'
import { Footer } from '@/components/sections'
import ProductDetail from '@/components/sections/ProductDetail'
import RelatedProducts from '@/components/sections/RelatedProducts'
import { getProductBySlug } from '@/lib/api/products'

export const revalidate = 900

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  
  try {
    const { product } = await getProductBySlug(slug, false)
    
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
  
  let productData
  try {
    productData = await getProductBySlug(slug, true, 6)
  } catch (error) {
    console.error('Failed to fetch product:', error)
    notFound()
  }

  const { product, category, related } = productData

  return (
    <>
      <Navigation position="static" />

      <main className="min-h-screen bg-black">
        <ProductDetail product={product} category={category} />
        
        {related && related.length > 0 && (
          <RelatedProducts products={related} />
        )}
      </main>

      <Footer />
      <ChatWidget />
    </>
  )
}