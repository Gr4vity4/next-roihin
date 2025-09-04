import { 
  Category, 
  Product, 
  CatalogResponse, 
  ProductDetailResponse
} from '@/lib/types/products'
import { getFetchConfig } from '@/config/cache.config'

const API_BASE_URL = process.env.WORDPRESS_API_URL

if (!API_BASE_URL) {
  throw new Error('WORDPRESS_API_URL is not defined in environment variables')
}

export async function getCategories(): Promise<Category[]> {
  // For now, return mock categories since the custom endpoint doesn't exist
  // In production, this should fetch from WordPress taxonomies
  return [
    { id: 1, name: 'Bracelets', slug: 'bracelets' },
    { id: 2, name: 'Stones', slug: 'stones' },
    { id: 3, name: 'Charms', slug: 'charms' }
  ]
}

export async function getProductsByCategory(
  categorySlug: string, 
  perPage: number = 12
): Promise<Product[]> {
  // Fetch all products and filter by category
  const allProducts = await getAllProducts('en')
  
  return allProducts
    .filter(product => product.product_category?.slug === categorySlug)
    .slice(0, perPage)
}

export async function getCatalog(perCat: number = 12): Promise<CatalogResponse> {
  // Fetch all products and group by category
  const allProducts = await getAllProducts('en')
  const categories = await getCategories()
  
  const catalog: CatalogResponse = {
    categories: categories.map(category => ({
      ...category,
      products: allProducts
        .filter(product => product.product_category?.slug === category.slug)
        .slice(0, perCat)
    }))
  }
  
  return catalog
}

export async function getProductById(
  id: number, 
  includeRelated: boolean = false,
  relatedLimit: number = 6
): Promise<ProductDetailResponse> {
  // Fetch product by ID using standard WordPress API
  const response = await fetch(
    `${API_BASE_URL}/wp-json/wp/v2/product/${id}`,
    getFetchConfig('api')
  )
  
  if (!response.ok) {
    throw new Error(`Failed to fetch product with ID ${id}: ${response.statusText}`)
  }
  
  const rawProduct: RawProduct = await response.json()
  
  // Transform raw product to match expected structure
  const product: Product = {
    id: rawProduct.id,
    slug: rawProduct.slug,
    title: rawProduct.title?.rendered || '',
    excerpt: rawProduct.excerpt?.rendered || '',
    featured_image_url: rawProduct.acf?.product_image || '',
    gallery_urls: rawProduct.acf?.product_gallery?.map((img) => img.url) || [],
    acf: {
      material: rawProduct.acf?.material || '',
      dimensions: rawProduct.acf?.size_dimensions || '',
      color_prices: rawProduct.acf?.color_options?.map(opt => ({
        color: opt.color,
        price: parseInt(opt.price) || 0,
        available: opt.available,
        color_icon: opt.color_icon_optional ? {
          id: 0,
          url: opt.color_icon_optional
        } : undefined
      })) || [],
      description_th: rawProduct.acf?.description_th || rawProduct.acf?.description || '',
      description_en: rawProduct.acf?.description_en || rawProduct.acf?.description || ''
    },
    product_category: {
      id: 0,
      name: rawProduct.acf?.product_category || '',
      slug: rawProduct.acf?.product_category?.toLowerCase().replace(/\s+/g, '-') || ''
    }
  }
  
  // Prepare the response
  const result: ProductDetailResponse = {
    product,
    category: product.product_category
  }
  
  // If related products are requested, fetch them from the same category
  if (includeRelated && product.product_category?.slug) {
    try {
      const allProducts = await getAllProducts(language)
      const related = allProducts
        .filter(p => 
          p.product_category?.slug === product.product_category?.slug && 
          p.id !== product.id
        )
        .slice(0, relatedLimit)
      
      result.related = related
    } catch (error) {
      console.error('Failed to fetch related products:', error)
      result.related = []
    }
  }
  
  return result
}

export async function getProductBySlug(
  slug: string,
  includeRelated: boolean = false,
  relatedLimit: number = 6,
  language: 'en' | 'th' = 'en'
): Promise<ProductDetailResponse> {
  // Add language prefix to API URL if Thai
  const langPrefix = language === 'th' ? '/th' : ''
  // Fetch product by slug using standard WordPress API
  const response = await fetch(
    `${API_BASE_URL}${langPrefix}/wp-json/wp/v2/product?slug=${slug}&per_page=1`,
    getFetchConfig('api')
  )
  
  if (!response.ok) {
    throw new Error(`Failed to fetch product with slug ${slug}: ${response.statusText}`)
  }
  
  const products: RawProduct[] = await response.json()
  
  if (!products || products.length === 0) {
    throw new Error(`Product with slug ${slug} not found`)
  }
  
  const rawProduct = products[0]
  
  // Transform raw product to match expected structure
  const product: Product = {
    id: rawProduct.id,
    slug: rawProduct.slug,
    title: rawProduct.title?.rendered || '',
    excerpt: rawProduct.excerpt?.rendered || '',
    featured_image_url: rawProduct.acf?.product_image || '',
    gallery_urls: rawProduct.acf?.product_gallery?.map((img) => img.url) || [],
    acf: {
      material: rawProduct.acf?.material || '',
      dimensions: rawProduct.acf?.size_dimensions || '',
      color_prices: rawProduct.acf?.color_options?.map(opt => ({
        color: opt.color,
        price: parseInt(opt.price) || 0,
        available: opt.available,
        color_icon: opt.color_icon_optional ? {
          id: 0,
          url: opt.color_icon_optional
        } : undefined
      })) || [],
      description_th: rawProduct.acf?.description_th || rawProduct.acf?.description || '',
      description_en: rawProduct.acf?.description_en || rawProduct.acf?.description || ''
    },
    product_category: {
      id: 0,
      name: rawProduct.acf?.product_category || '',
      slug: rawProduct.acf?.product_category?.toLowerCase().replace(/\s+/g, '-') || ''
    }
  }
  
  // Prepare the response
  const result: ProductDetailResponse = {
    product,
    category: product.product_category
  }
  
  // If related products are requested, fetch them from the same category
  if (includeRelated && product.product_category?.slug) {
    try {
      const allProducts = await getAllProducts(language)
      const related = allProducts
        .filter(p => 
          p.product_category?.slug === product.product_category?.slug && 
          p.id !== product.id
        )
        .slice(0, relatedLimit)
      
      result.related = related
    } catch (error) {
      console.error('Failed to fetch related products:', error)
      result.related = []
    }
  }
  
  return result
}

interface RawProduct {
  id: number
  slug: string
  title?: {
    rendered: string
  }
  excerpt?: {
    rendered?: string
  }
  acf?: {
    product_category?: string
    product_image?: string
    product_gallery?: Array<{ url: string }>
    material?: string
    size_dimensions?: string
    color_options?: Array<{
      color: string
      color_icon_optional?: string
      price: string
      available: boolean
    }>
    description?: string
    description_th?: string
    description_en?: string
  }
}

export async function getAllProducts(language: 'en' | 'th' = 'en'): Promise<Product[]> {
  const langPrefix = language === 'th' ? '/th' : ''
  const response = await fetch(
    `${API_BASE_URL}${langPrefix}/wp-json/wp/v2/product?per_page=100`,
    getFetchConfig('api')
  )
  
  if (!response.ok) {
    throw new Error(`Failed to fetch all products: ${response.statusText}`)
  }
  
  const rawProducts: RawProduct[] = await response.json()
  
  return rawProducts.map((product) => ({
    id: product.id,
    slug: product.slug,
    title: product.title?.rendered || '',
    excerpt: product.excerpt?.rendered || '',
    featured_image_url: product.acf?.product_image || '',
    gallery_urls: product.acf?.product_gallery?.map((img) => img.url) || [],
    acf: {
      material: product.acf?.material || '',
      dimensions: product.acf?.size_dimensions || '',
      color_prices: product.acf?.color_options?.map(opt => ({
        color: opt.color,
        price: parseInt(opt.price) || 0,
        available: opt.available,
        color_icon: opt.color_icon_optional ? {
          id: 0,
          url: opt.color_icon_optional
        } : undefined
      })) || [],
      description_th: product.acf?.description_th || product.acf?.description || '',
      description_en: product.acf?.description_en || product.acf?.description || ''
    },
    product_category: {
      id: 0,
      name: product.acf?.product_category || '',
      slug: product.acf?.product_category?.toLowerCase().replace(/\s+/g, '-') || ''
    }
  }))
}