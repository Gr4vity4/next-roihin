import {
  Category,
  Product,
  CatalogResponse,
  ProductDetailResponse,
  LaravelProductResponse,
  LaravelProductsResponse,
  PaginationMeta
} from '@/lib/types/products'
import { getFetchConfig } from '@/config/cache.config'
import { buildLaravelApiUrl } from '@/config/api.config'
import { getErrorMessage } from '@/lib/utils/error-handler'

/**
 * Transform Laravel API response to Product type
 */
function transformLaravelProduct(laravelProduct: LaravelProductResponse): Product {
  return {
    id: laravelProduct.id,
    slug: laravelProduct.slug,
    title: laravelProduct.title,
    excerpt: laravelProduct.excerpt,
    featured_image_url: laravelProduct.featured_image_url,
    gallery_urls: laravelProduct.gallery_urls,
    acf: {
      material: laravelProduct.acf.material,
      dimensions: laravelProduct.acf.dimensions,
      color_prices: laravelProduct.acf.color_prices,
      description_th: laravelProduct.acf.description_th,
      description_en: laravelProduct.acf.description_en,
      materials_th: laravelProduct.acf.materials_th,
      materials_en: laravelProduct.acf.materials_en,
      composition_th: laravelProduct.acf.composition_th,
      composition_en: laravelProduct.acf.composition_en,
      about_this_piece_th: laravelProduct.acf.about_this_piece_th,
      about_this_piece_en: laravelProduct.acf.about_this_piece_en,
      who_is_this_for_th: laravelProduct.acf.who_is_this_for_th,
      who_is_this_for_en: laravelProduct.acf.who_is_this_for_en,
      notes_th: laravelProduct.acf.notes_th,
      notes_en: laravelProduct.acf.notes_en,
      shipping_options_th: laravelProduct.acf.shipping_options_th,
      shipping_options_en: laravelProduct.acf.shipping_options_en,
      gifting_th: laravelProduct.acf.gifting_th,
      gifting_en: laravelProduct.acf.gifting_en,
      sustainability_th: laravelProduct.acf.sustainability_th,
      sustainability_en: laravelProduct.acf.sustainability_en,
    },
    product_category: laravelProduct.product_category,
    crystal_id: laravelProduct.crystal_id,
    is_favorite: laravelProduct.is_favorite,
    is_arrival: laravelProduct.is_arrival,
  }
}

export interface ProductListResult {
  products: Product[]
  pagination?: PaginationMeta
}

export interface FetchProductsOptions {
  category?: string
  isArrival?: boolean
  perPage?: number
  page?: number
  crystalId?: string | number
  language?: 'en' | 'th'
}

export async function fetchProducts(options: FetchProductsOptions = {}): Promise<ProductListResult> {
  const { category, isArrival, perPage, page, crystalId, language = 'en' } = options

  const params: Record<string, string | number | boolean | undefined> = {
    locale: language,
    category,
    crystal_id: crystalId,
    per_page: perPage,
    page,
  }

  if (typeof isArrival === 'boolean') {
    params.is_arrival = isArrival ? '1' : '0'
  }

  const url = buildLaravelApiUrl('products', params)
  const response = await fetch(url, getFetchConfig('api'))

  if (!response.ok) {
    throw new Error(`Failed to fetch products (${response.status}): ${response.statusText}`)
  }

  const apiResponse: LaravelProductsResponse = await response.json()
  const products = apiResponse.data.map(transformLaravelProduct)

  return {
    products,
    pagination: apiResponse.meta?.pagination,
  }
}

export async function getCategories(): Promise<Category[]> {
  // For now, return mock categories since the custom endpoint doesn't exist
  // In production, this should fetch from WordPress taxonomies
  return [
    {
      id: 1,
      name_en: 'Bracelets',
      name_th: 'สร้อยข้อมือ',
      slug: 'bracelets',
      count: 0,
      products_endpoint: '/api/products?category=bracelets'
    },
    {
      id: 2,
      name_en: 'Stones',
      name_th: 'หิน',
      slug: 'stones',
      count: 0,
      products_endpoint: '/api/products?category=stones'
    },
    {
      id: 3,
      name_en: 'Charms',
      name_th: 'ชาร์ม',
      slug: 'charms',
      count: 0,
      products_endpoint: '/api/products?category=charms'
    }
  ]
}

export async function getProductsByCategory(
  categorySlug: string,
  perPage: number = 12,
  language: 'en' | 'th' = 'en'
): Promise<Product[]> {
  const { products } = await fetchProducts({
    category: categorySlug,
    perPage,
    language,
  })

  return products
}

export async function getProductsByCrystalId(
  crystalId: string | number,
  perPage: number = 12,
  language: 'en' | 'th' = 'en'
): Promise<Product[]> {
  try {
    const isBrowser = typeof window !== 'undefined'
    let url: string

    if (isBrowser) {
      const apiBase = (process.env.NEXT_PUBLIC_API_URL || '/api').replace(/\/$/, '')
      const params = new URLSearchParams({
        locale: language,
        crystalId: String(crystalId),
        per_page: String(perPage),
      })
      url = `${apiBase}/products?${params.toString()}`
    } else {
      url = buildLaravelApiUrl('products', {
        locale: language,
        per_page: perPage,
        crystal_id: crystalId,
      })
    }

    const response = await fetch(url, getFetchConfig('api'))

    if (!response.ok) {
      throw new Error(`Failed to fetch products for crystal ${crystalId}: ${response.statusText}`)
    }

    const payload: unknown = await response.json()
    const items: LaravelProductResponse[] = Array.isArray(payload)
      ? payload
      : Array.isArray((payload as { data?: unknown }).data)
        ? ((payload as { data: LaravelProductResponse[] }).data)
        : []

    return items.map(transformLaravelProduct)
  } catch (error) {
    throw new Error(getErrorMessage(error, `Failed to fetch crystal products for ${crystalId}`))
  }
}

export async function getCatalog(perCat: number = 12, language: 'en' | 'th' = 'en'): Promise<CatalogResponse> {
  // Fetch all products and group by category
  const allProducts = await getAllProducts(language)
  const categories = await getCategories()

  const catalog: CatalogResponse = {
    sections: categories.map(category => ({
      category: category,
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
  relatedLimit: number = 6,
  language: 'en' | 'th' = 'en'
): Promise<ProductDetailResponse> {
  try {
    const url = buildLaravelApiUrl(`products/${id}`, { locale: language })
    const response = await fetch(url, getFetchConfig('api'))

    if (!response.ok) {
      throw new Error(`Failed to fetch product with ID ${id}: ${response.statusText}`)
    }

    const apiResponse: { data: LaravelProductResponse; meta: { locale: string } } = await response.json()
    const product = transformLaravelProduct(apiResponse.data)

    // Prepare the response with a proper Category object
    const category: Category = {
      id: product.product_category.id,
      slug: product.product_category.slug,
      name_en: product.product_category.name,
      name_th: product.product_category.name,
      count: 0,
      products_endpoint: `/api/products?category=${product.product_category.slug}`
    }

    const result: ProductDetailResponse = {
      product,
      category
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
  } catch (error) {
    throw new Error(getErrorMessage(error, `Failed to fetch product with ID ${id}`))
  }
}

export async function getProductBySlug(
  slug: string,
  includeRelated: boolean = false,
  relatedLimit: number = 6,
  language: 'en' | 'th' = 'en'
): Promise<ProductDetailResponse> {
  try {
    // Fetch all products and find by slug
    const allProducts = await getAllProducts(language)
    const product = allProducts.find(p => p.slug === slug)

    if (!product) {
      throw new Error(`Product with slug ${slug} not found`)
    }

    // Prepare the response with a proper Category object
    const category: Category = {
      id: product.product_category.id,
      slug: product.product_category.slug,
      name_en: product.product_category.name,
      name_th: product.product_category.name,
      count: 0,
      products_endpoint: `/api/products?category=${product.product_category.slug}`
    }

    const result: ProductDetailResponse = {
      product,
      category
    }

    // If related products are requested, fetch them from the same category
    if (includeRelated && product.product_category?.slug) {
      try {
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
  } catch (error) {
    throw new Error(getErrorMessage(error, `Failed to fetch product with slug ${slug}`))
  }
}

export async function getAllProducts(language: 'en' | 'th' = 'en'): Promise<Product[]> {
  try {
    const url = buildLaravelApiUrl('products', { locale: language })
    const response = await fetch(url, getFetchConfig('api'))

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText)
      throw new Error(`Failed to fetch all products (${response.status}): ${errorText}`)
    }

    const apiResponse: LaravelProductsResponse = await response.json()

    return apiResponse.data.map(transformLaravelProduct)
  } catch (error) {
    // Network errors or fetch failures
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Unable to connect to Laravel API at ${buildLaravelApiUrl('products', { locale: language })}. Ensure backend server is running.`)
    }
    throw new Error(getErrorMessage(error, 'Failed to fetch products'))
  }
}
