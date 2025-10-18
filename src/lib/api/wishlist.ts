import { getLaravelApiEndpoint } from '@/config/api.config'
import type {
  WishlistToggleParams,
  WishlistToggleResponse,
  WishlistResponse,
} from '@/lib/types/wishlist'

type RawWishlistItem = {
  id: number | string
  product_id: number
  product_color_option_id?: number | null
  color?: string | null
  added_at?: string
  product?: {
    id?: number
    slug?: string
    title?: string
    featured_image_url?: string | null
    gallery_urls?: string[]
    excerpt?: string
    acf?: unknown
    product_category?: unknown
    price?: number
    is_available?: boolean
  }
}

// Re-export types for convenience
export type { WishlistItem } from '@/lib/types/wishlist'

export async function toggleWishlist({
  token,
  productId,
  color = null,
  colorOptionId = null,
  op,
}: WishlistToggleParams): Promise<WishlistToggleResponse> {
  const payload: Record<string, unknown> = {
    color,
    color_option_id: colorOptionId,
  }

  if (payload.color === undefined) {
    delete payload.color
  }

  if (payload.color_option_id === undefined) {
    delete payload.color_option_id
  }

  if (op) {
    payload.op = op
  }

  const response = await fetch(getLaravelApiEndpoint(`/products/${productId}/wishlist`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || 'Failed to toggle wishlist')
  }

  const result = await response.json()
  const data = result.data ?? {}
  const meta = result.meta ?? {}
  const action = (meta.action ?? result.action ?? (meta.is_favorite ? 'added' : 'removed')) as WishlistToggleResponse['action']
  const wishlistItemId = meta.wishlist_item_id ?? data.id ?? null
  const addedAt = typeof data.added_at === 'string' ? Date.parse(data.added_at) : Date.now()

  return {
    action,
    item: {
      id: wishlistItemId ? String(wishlistItemId) : `${productId}:${color ?? 'default'}`,
      product_id: data.product_id ?? productId,
      product_color_option_id: data.product_color_option_id ?? meta.product_color_option_id ?? colorOptionId ?? null,
      color: data.color ?? meta.color ?? color ?? null,
      added_at: Number.isNaN(addedAt) ? Date.now() : addedAt,
    },
    count: meta.total ?? 0,
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

  const result = await response.json() as { data?: unknown; meta?: Record<string, unknown> }
  const entries: RawWishlistItem[] = Array.isArray(result.data) ? (result.data as RawWishlistItem[]) : []
  const total = result.meta?.total ?? entries.length

  const items = entries.map((entry) => {
    const product = entry.product ?? {}
    const addedAt = typeof entry.added_at === 'string' ? Date.parse(entry.added_at) : Date.now()
    const productColorOptionId = entry.product_color_option_id ?? null
    const color = entry.color ?? null

    const priceValue = typeof product.price === 'number' ? product.price : 0
    const isAvailable = typeof product.is_available === 'boolean' ? product.is_available : true
    const featuredImage = product.featured_image_url ?? product.gallery_urls?.[0] ?? null

    return {
      id: String(entry.id),
      product_id: entry.product_id,
      product_color_option_id: productColorOptionId,
      color,
      color_key: productColorOptionId ? `color-option:${productColorOptionId}` : color,
      note: null,
      added_at: Number.isNaN(addedAt) ? Date.now() : addedAt,
      product: product.id
        ? {
            id: product.id,
            slug: product.slug,
            title: product.title,
            featured_image_url: featuredImage,
            excerpt: product.excerpt,
            acf: product.acf,
            product_category: product.product_category,
          }
        : undefined,
      price: {
        min_price: priceValue,
        available_any: isAvailable,
        selected: undefined,
      },
      is_available: isAvailable,
      display_price: priceValue,
    }
  })

  return {
    count: total,
    items,
  }
}

export async function removeWishlistItem(
  token: string,
  params: {
    productId: number
    color?: string | null
    colorOptionId?: number | null
  }
): Promise<void> {
  await toggleWishlist({
    token,
    productId: params.productId,
    color: params.color ?? null,
    colorOptionId: params.colorOptionId ?? null,
  })
}

export async function clearWishlist(token: string): Promise<void> {
  const wishlist = await fetchWishlist(token)

  await Promise.all(
    wishlist.items.map(item =>
      removeWishlistItem(token, {
        productId: item.product_id,
        color: item.color ?? null,
        colorOptionId: item.product_color_option_id ?? null,
      })
    )
  )
}
