/**
 * Centralized Wishlist Type Definitions
 *
 * These types are shared across the application to ensure consistency
 * between API responses, context state, and component props.
 */

/**
 * Wishlist item with product details and pricing information
 */
export interface WishlistItem {
  id: string
  product_id: number
  product_color_option_id?: number | null
  color?: string | null
  color_key?: string | null
  note?: string
  added_at: number
  product?: {
    id: number
    slug: string
    title: string
    featured_image_url?: string
    [key: string]: unknown
  }
  price?: {
    min_price: number
    available_any: boolean
    selected?: {
      color: string
      price: number
      available: boolean
    }
  }
  is_available?: boolean
  display_price?: number
}

/**
 * Wishlist API response containing count and items
 */
export interface WishlistResponse {
  count: number
  items: WishlistItem[]
}

/**
 * Parameters for toggling a wishlist item
 */
export interface WishlistToggleParams {
  token: string
  productId: number
  color?: string | null
  colorOptionId?: number | null
  op?: 'add' | 'remove' | 'toggle'
}

/**
 * Response from toggling a wishlist item
 */
export interface WishlistToggleResponse {
  action: 'added' | 'removed' | 'kept'
  item: {
    id: string
    product_id: number
    product_color_option_id?: number | null
    color?: string
    added_at: number
  }
  count: number
}

/**
 * Response for checking if a product is in the wishlist
 */
export interface WishlistContainsResponse {
  exists: boolean
  item_id?: string
}

/**
 * Response for checking multiple wishlist items
 */
export interface WishlistCheckResponse {
  map: Record<string, string | null>
}

/**
 * Response for checking favorite status
 */
export interface WishlistFavoriteResponse {
  favorite: boolean
  item_id: string | null
}
