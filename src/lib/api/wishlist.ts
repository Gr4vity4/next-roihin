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

interface WishlistFavoriteResponse {
  favorite: boolean
  item_id: string | null
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
      product: productId,
      color: color ?? null,
      op,
    }),
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to toggle wishlist')
  }

  const data = await response.json()
  
  // Map WordPress API response to our expected format
  if (data.added) {
    return {
      action: 'added',
      item: {
        id: data.item.id,
        product_id: data.item.product,
        color: data.item.color,
        added_at: new Date(data.item.added_at).getTime(),
      },
      count: data.count,
    }
  } else if (data.removed) {
    return {
      action: 'removed',
      item: {
        id: data.item.id,
        product_id: data.item.product,
        color: data.item.color,
        added_at: new Date(data.item.added_at).getTime(),
      },
      count: data.count,
    }
  }
  
  // Fallback for toggle without explicit add/remove
  return {
    action: 'kept',
    item: {
      id: data.item.id,
      product_id: data.item.product,
      color: data.item.color,
      added_at: new Date(data.item.added_at).getTime(),
    },
    count: data.count,
  }
}

export async function fetchWishlist(token: string): Promise<WishlistResponse> {
  // Add timestamp to ensure fresh data
  const response = await fetch(`${API_URL}/wp-json/roihin/v1/wishlist?t=${Date.now()}`, {
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

  interface WishlistApiItem {
    id: string
    product: number
    color?: string
    color_key?: string
    note?: string
    added_at: string
  }

  interface WishlistApiResponse {
    user?: number
    count: number
    items: WishlistApiItem[]
  }

  const wishlistData: WishlistApiResponse = await response.json()
  
  // Fetch product details for each wishlist item
  const itemsWithDetails = await Promise.all(
    wishlistData.items.map(async (item: WishlistApiItem) => {
      try {
        // Fetch product ACF fields
        const productResponse = await fetch(
          `${API_URL}/wp-json/wp/v2/product/${item.product}?_fields=acf,title,slug`,
          {
            cache: 'no-store',
          }
        )

        if (!productResponse.ok) {
          throw new Error(`Failed to fetch product ${item.product}`)
        }

        interface ProductApiResponse {
          id: number
          slug?: string
          title?: {
            rendered: string
          }
          acf?: {
            product_image?: string
            product_gallery?: Array<{ url: string }>
            color_options?: Array<{
              color: string
              price: string
              available: boolean
            }>
          }
        }

        const productData: ProductApiResponse = await productResponse.json()
        
        // Find the color option to get the price and availability
        const colorOption = productData.acf?.color_options?.find(
          (opt) => opt.color.toLowerCase() === item.color?.toLowerCase()
        )
        
        // Determine price and availability
        let displayPrice = 0
        let isAvailable = false
        
        if (colorOption) {
          displayPrice = parseInt(colorOption.price) || 0
          isAvailable = colorOption.available === true
        } else if (productData.acf?.color_options?.length > 0) {
          // If no color match, use the first available option
          const firstOption = productData.acf.color_options[0]
          displayPrice = parseInt(firstOption.price) || 0
          isAvailable = firstOption.available === true
        }

        return {
          id: item.id,
          product_id: item.product,
          color: item.color,
          color_key: item.color_key,
          note: item.note,
          added_at: new Date(item.added_at).getTime(),
          product: {
            id: item.product,
            slug: productData.slug || `product-${item.product}`,
            title: productData.title?.rendered || `Product ${item.product}`,
            featured_image_url: productData.acf?.product_image || productData.acf?.product_gallery?.[0]?.url || null,
            acf: productData.acf,
          },
          price: {
            min_price: displayPrice,
            available_any: productData.acf?.color_options?.some((opt) => opt.available) || false,
            selected: colorOption ? {
              color: colorOption.color,
              price: parseInt(colorOption.price) || 0,
              available: colorOption.available,
            } : undefined,
          },
          is_available: isAvailable,
          display_price: displayPrice,
        }
      } catch (error) {
        console.error(`Error fetching product details for item ${item.id}:`, error)
        // Return the item with minimal data if product fetch fails
        return {
          id: item.id,
          product_id: item.product,
          color: item.color,
          color_key: item.color_key,
          note: item.note,
          added_at: new Date(item.added_at).getTime(),
          product: {
            id: item.product,
            slug: `product-${item.product}`,
            title: `Product ${item.product}`,
            featured_image_url: null,
          },
          price: {
            min_price: 0,
            available_any: false,
          },
          is_available: false,
          display_price: 0,
        }
      }
    })
  )

  return {
    count: wishlistData.count || itemsWithDetails.length,
    items: itemsWithDetails,
  }
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

export async function checkFavorite(
  token: string,
  productId: number,
  color?: string
): Promise<WishlistFavoriteResponse> {
  const url = new URL(`${API_URL}/wp-json/roihin/v1/wishlist/is-favorite`)
  url.searchParams.append('product', productId.toString())
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
    throw new Error(error.message || 'Failed to check favorite status')
  }

  return response.json()
}