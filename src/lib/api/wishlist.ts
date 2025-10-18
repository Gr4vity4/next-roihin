import { getLaravelApiEndpoint } from '@/config/api.config'
import type {
  WishlistToggleParams,
  WishlistToggleResponse,
  WishlistResponse,
} from '@/lib/types/wishlist'

// Re-export types for convenience
export type { WishlistItem } from '@/lib/types/wishlist'

export async function toggleWishlist({
  token,
  productId,
}: Omit<WishlistToggleParams, 'color' | 'op'>): Promise<WishlistToggleResponse> {
  const response = await fetch(getLaravelApiEndpoint(`/products/${productId}/wishlist`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to toggle wishlist')
  }

  const result = await response.json()
  const data = result.data || result
  const isFavorite = result.meta?.is_favorite ?? false

  // Map Laravel API response to our expected format
  return {
    action: isFavorite ? 'added' : 'removed',
    item: {
      id: String(data.id),
      product_id: data.id,
      color: null,
      added_at: Date.now(),
    },
    count: result.meta?.total ?? 1,
  }
}

export async function fetchWishlist(token: string): Promise<WishlistResponse> {
  const response = await fetch(getLaravelApiEndpoint('/wishlist'), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
    cache: 'no-store',
  })

  if (response.status === 401) {
    throw new Error('AUTH')
  }

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch wishlist')
  }

  const result = await response.json()
  const products = result.data || []
  const total = result.meta?.total ?? products.length

  // Map Laravel products to wishlist items
  const items = products.map((product: Record<string, unknown>) => ({
    id: String(product.id),
    product_id: product.id,
    color: null,
    color_key: null,
    note: null,
    added_at: Date.now(),
    product: {
      id: product.id,
      slug: product.slug,
      title: product.title,
      featured_image_url: product.gallery_images?.[0]?.image_url || product.image_url,
      acf: undefined,
    },
    price: {
      min_price: product.price || 0,
      available_any: product.is_available ?? true,
      selected: undefined,
    },
    is_available: product.is_available ?? true,
    display_price: product.price || 0,
  }))

  return {
    count: total,
    items,
  }
}

export async function removeWishlistItem(token: string, productId: string): Promise<void> {
  // Use toggle endpoint to remove
  await toggleWishlist({ token, productId: parseInt(productId) })
}

export async function clearWishlist(token: string): Promise<void> {
  // Fetch all items and remove them one by one
  const wishlist = await fetchWishlist(token)

  await Promise.all(
    wishlist.items.map(item =>
      removeWishlistItem(token, String(item.product_id))
    )
  )
}
