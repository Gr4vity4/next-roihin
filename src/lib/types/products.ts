export interface ColorPrice {
  color: string
  price: number
  available: boolean
  color_icon?: {
    id: number
    url: string
  } | null
  gallery_images?: string[]
}

export interface ProductACF {
  material?: string
  dimensions?: string
  color_prices?: ColorPrice[]
  description_th?: string
  description_en?: string
}

export interface ProductCategory {
  id: number
  name: string
  slug: string
}

export interface Product {
  id: number
  slug: string
  title: string
  excerpt: string
  featured_image_url: string
  gallery_urls: string[]
  acf: ProductACF
  product_category: ProductCategory
  is_favorite?: boolean
}

/**
 * Laravel API response for product
 * Matches the structure from ProductResource on back-end
 */
export interface LaravelProductResponse {
  id: number
  slug: string
  title: string
  excerpt: string
  featured_image_url: string
  gallery_urls: string[]
  acf: {
    material: string
    dimensions: string
    color_prices: ColorPrice[]
    description_th: string
    description_en: string
  }
  product_category: {
    id: number
    name: string
    slug: string
  }
  is_favorite: boolean
}

/**
 * Laravel API list response with metadata
 */
export interface LaravelProductsResponse {
  data: LaravelProductResponse[]
  meta: {
    locale: string
  }
}

export interface Category {
  id: number
  slug: string
  name_en: string
  name_th: string
  intro_th?: string
  intro_en?: string
  count: number
  products_endpoint: string
}

export interface CatalogSection {
  category: Category
  products: Product[]
}

export interface CatalogResponse {
  sections: CatalogSection[]
}

export interface ProductDetailResponse {
  product: Product
  category: Category
  related?: Product[]
}