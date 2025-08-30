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
  const response = await fetch(
    `${API_BASE_URL}/wp-json/roihin/v1/categories`,
    getFetchConfig('api')
  )
  
  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.statusText}`)
  }
  
  return response.json()
}

export async function getProductsByCategory(
  categorySlug: string, 
  perPage: number = 12
): Promise<Product[]> {
  const response = await fetch(
    `${API_BASE_URL}/wp-json/roihin/v1/category/${categorySlug}/products?per_page=${perPage}`,
    getFetchConfig('api')
  )
  
  if (!response.ok) {
    throw new Error(`Failed to fetch products for category ${categorySlug}: ${response.statusText}`)
  }
  
  return response.json()
}

export async function getCatalog(perCat: number = 12): Promise<CatalogResponse> {
  const response = await fetch(
    `${API_BASE_URL}/wp-json/roihin/v1/catalog?per_cat=${perCat}`,
    getFetchConfig('api')
  )
  
  if (!response.ok) {
    throw new Error(`Failed to fetch catalog: ${response.statusText}`)
  }
  
  return response.json()
}

export async function getProductById(
  id: number, 
  includeRelated: boolean = false,
  relatedLimit: number = 6
): Promise<ProductDetailResponse> {
  const params = new URLSearchParams()
  if (includeRelated) {
    params.append('related', '1')
    params.append('related_limit', relatedLimit.toString())
  }
  
  const response = await fetch(
    `${API_BASE_URL}/wp-json/roihin/v1/product/${id}${params.toString() ? `?${params.toString()}` : ''}`,
    getFetchConfig('api')
  )
  
  if (!response.ok) {
    throw new Error(`Failed to fetch product with ID ${id}: ${response.statusText}`)
  }
  
  return response.json()
}

export async function getProductBySlug(
  slug: string,
  includeRelated: boolean = false,
  relatedLimit: number = 6
): Promise<ProductDetailResponse> {
  const params = new URLSearchParams()
  if (includeRelated) {
    params.append('related', '1')
    params.append('related_limit', relatedLimit.toString())
  }
  
  const response = await fetch(
    `${API_BASE_URL}/wp-json/roihin/v1/product/by-slug/${slug}${params.toString() ? `?${params.toString()}` : ''}`,
    getFetchConfig('api')
  )
  
  if (!response.ok) {
    throw new Error(`Failed to fetch product with slug ${slug}: ${response.statusText}`)
  }
  
  return response.json()
}