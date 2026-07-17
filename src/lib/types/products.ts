export interface ColorPrice {
  id?: number | string | null
  color: string
  price: number
  available: boolean
  color_icon?: {
    id: number
    url: string
  } | null
  gallery_images?: string[]
}

export interface ProductDetailSections {
  materials_th?: string
  materials_en?: string
  composition_th?: string
  composition_en?: string
  about_this_piece_th?: string
  about_this_piece_en?: string
  who_is_this_for_th?: string
  who_is_this_for_en?: string
  notes_th?: string
  notes_en?: string
  shipping_options_th?: string
  shipping_options_en?: string
  gifting_th?: string
  gifting_en?: string
  sustainability_th?: string
  sustainability_en?: string
}

export interface ProductACF extends ProductDetailSections {
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
  crystal_id?: number | null
  is_favorite?: boolean
  is_arrival?: boolean
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
  } & ProductDetailSections
  product_category: {
    id: number
    name: string
    slug: string
  }
  crystal_id: number | null
  is_favorite: boolean
  is_arrival: boolean
}

/**
 * Laravel API list response with metadata
 */
export interface LaravelProductsResponse {
  data: LaravelProductResponse[]
  meta: {
    locale: string
    pagination?: PaginationMeta
  }
}

export interface PaginationMeta {
  current_page: number
  per_page: number
  total: number
  last_page: number
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
