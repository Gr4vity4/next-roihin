import {
  Category,
  Product,
  CatalogResponse,
  ProductDetailResponse,
  LaravelProductResponse,
  LaravelProductsResponse
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
    },
    product_category: laravelProduct.product_category,
    is_favorite: laravelProduct.is_favorite,
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
  // Fetch all products and filter by category
  const allProducts = await getAllProducts(language)

  return allProducts
    .filter(product => product.product_category?.slug === categorySlug)
    .slice(0, perPage)
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
      throw new Error(`Failed to fetch all products: ${response.statusText}`)
    }

    const apiResponse: LaravelProductsResponse = await response.json()

    return apiResponse.data.map(transformLaravelProduct)
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Failed to fetch products'))
  }
}
