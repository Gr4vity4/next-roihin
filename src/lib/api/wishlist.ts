interface WishlistToggleParams {
  token: string
  productId: number
  color?: string | null
  op?: 'add' | 'remove' | 'toggle'
}

interface WishlistToggleResponse {
  action: 'added' | 'removed' | 'kept'
  item: {
    id: string
    product_id: number
    color?: string
    added_at: number
  }
  count: number
}

interface WishlistItem {
  id: string
  product_id: number
  color?: string
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

interface WishlistResponse {
  count: number
  items: WishlistItem[]
}

interface WishlistContainsResponse {
  exists: boolean
  item_id?: string
}

interface WishlistCheckResponse {
  map: Record<string, string | null>
}

const API_URL = process.env.WORDPRESS_API_URL || 'https://wp-roihin.precisiondevlab.com'

export async function toggleWishlist({
  token,
  productId,
  color,
  op,
}: WishlistToggleParams): Promise<WishlistToggleResponse> {
  const response = await fetch(`${API_URL}/wp-json/roihin/v1/wishlist/toggle`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      product_id: productId,
      color: color ?? null,
      op,
    }),
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to toggle wishlist')
  }

  return response.json()
}

export async function fetchWishlist(token: string): Promise<WishlistResponse> {
  const response = await fetch(`${API_URL}/wp-json/roihin/v1/wishlist?expand=1`, {
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

  return response.json()
}

export async function checkWishlistItem(
  token: string,
  productId: number,
  color?: string
): Promise<WishlistContainsResponse> {
  const url = new URL(`${API_URL}/wp-json/roihin/v1/wishlist/contains/${productId}`)
  if (color) {
    url.searchParams.append('color', color)
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to check wishlist item')
  }

  return response.json()
}

export async function checkMultipleWishlistItems(
  token: string,
  productIds: number[],
  color?: string
): Promise<WishlistCheckResponse> {
  const url = new URL(`${API_URL}/wp-json/roihin/v1/wishlist/check`)
  url.searchParams.append('ids', productIds.join(','))
  if (color) {
    url.searchParams.append('color', color)
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to check wishlist items')
  }

  return response.json()
}

export async function removeWishlistItem(token: string, itemId: string): Promise<void> {
  const response = await fetch(`${API_URL}/wp-json/roihin/v1/wishlist/${itemId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to remove wishlist item')
  }
}

export async function clearWishlist(token: string): Promise<void> {
  const response = await fetch(`${API_URL}/wp-json/roihin/v1/wishlist`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to clear wishlist')
  }
}