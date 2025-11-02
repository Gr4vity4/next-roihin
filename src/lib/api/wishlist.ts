import { getLaravelApiEndpoint } from '@/config/api.config'
import type {
  WishlistItem,
  WishlistToggleParams,
  WishlistToggleResponse,
  WishlistResponse,
} from '@/lib/types/wishlist'

type RawWishlistItem = {
  id: number | string
  product_id: number
  product_color_option_id?: number | null
  color?: string | null
  color_option?: {
    id?: number | string | null
    color?: string | null
    price?: number | string | null
    available?: boolean
    gallery_images?: unknown
  } | null
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
  const totalValue = result.meta?.total
  const total = typeof totalValue === 'number' && Number.isFinite(totalValue)
    ? totalValue
    : entries.length

  const items = entries.map((entry) => {
    const product = entry.product ?? {}
    const productIdValue =
      typeof product?.id === 'number' && Number.isFinite(product.id)
        ? product.id
        : entry.product_id
    const productSlug =
      typeof product?.slug === 'string' && product.slug.trim() !== ''
        ? product.slug
        : `product-${productIdValue}`
    const productTitle =
      typeof product?.title === 'string' && product.title.trim() !== ''
        ? product.title
        : `Product ${productIdValue}`
    const productAcfData =
      product?.acf && typeof product.acf === 'object'
        ? (product.acf as Record<string, unknown>)
        : undefined
    const addedAt = typeof entry.added_at === 'string' ? Date.parse(entry.added_at) : Date.now()
    const rawFeaturedImage =
      typeof product?.featured_image_url === 'string' && product.featured_image_url.trim() !== ''
        ? product.featured_image_url
        : null
    const galleryUrlsRaw = Array.isArray(product?.gallery_urls) ? product.gallery_urls : []
    const galleryUrls = galleryUrlsRaw
      .map((url) => (typeof url === 'string' ? url : null))
      .filter((url): url is string => url !== null && url.trim() !== '')
    const normalizedFeaturedImage = rawFeaturedImage ?? (galleryUrls[0] ?? undefined)
    const rawOptionId = entry.product_color_option_id ?? null

    const parseNumericValue = (value: unknown): number => {
      if (typeof value === 'number') {
        return Number.isFinite(value) ? value : 0
      }
      if (typeof value === 'string') {
        const sanitized = value
          .replace(/[^\d.,-]/g, '')
          .replace(/,/g, '')
        const parsed = Number(sanitized)
        return Number.isFinite(parsed) ? parsed : 0
      }
      return 0
    }

    const parseBooleanValue = (value: unknown): boolean => {
      if (typeof value === 'boolean') {
        return value
      }
      if (typeof value === 'number') {
        return value !== 0
      }
      if (typeof value === 'string') {
        const normalized = value.trim().toLowerCase()
        if (normalized === 'true' || normalized === '1' || normalized === 'yes') {
          return true
        }
        if (normalized === 'false' || normalized === '0' || normalized === 'no') {
          return false
        }
      }
      return Boolean(value)
    }

    type NormalizedColorOption = {
      id: number | null
      color: string | null
      price: number
      available: boolean
      gallery_images: string[]
    }

    const normalizeColorOption = (option: RawWishlistItem['color_option']): NormalizedColorOption | null => {
      if (!option || typeof option !== 'object') {
        return null
      }

      const idValue = option.id
      let id: number | null = null
      if (typeof idValue === 'number') {
        id = Number.isFinite(idValue) ? idValue : null
      } else if (typeof idValue === 'string') {
        const parsed = Number(idValue)
        id = Number.isFinite(parsed) ? parsed : null
      }

      const color = typeof option.color === 'string' ? option.color : null
      const price = parseNumericValue(option.price)
      const available = parseBooleanValue(option.available)
      const galleryImagesRaw = Array.isArray(option.gallery_images) ? option.gallery_images : []
      const galleryImages = galleryImagesRaw
        .map((image) => {
          if (typeof image === 'string') {
            return image.trim() === '' ? null : image
          }
          if (image && typeof image === 'object') {
            const candidateUrl = (image as { url?: unknown }).url
            return typeof candidateUrl === 'string' && candidateUrl.trim() !== '' ? candidateUrl : null
          }
          return null
        })
        .filter((url): url is string => url !== null)

      return {
        id,
        color,
        price,
        available,
        gallery_images: galleryImages,
      }
    }

    const normalizeProductColorOption = (option: unknown): NormalizedColorOption | null => {
      if (!option || typeof option !== 'object') {
        return null
      }
      const candidate = option as { id?: unknown; color?: unknown; price?: unknown; available?: unknown; gallery_images?: unknown }
      const idValue = candidate.id
      let id: number | null = null
      if (typeof idValue === 'number') {
        id = Number.isFinite(idValue) ? idValue : null
      } else if (typeof idValue === 'string') {
        const parsed = Number(idValue)
        id = Number.isFinite(parsed) ? parsed : null
      }
      const color = typeof candidate.color === 'string' ? candidate.color : null
      const price = parseNumericValue(candidate.price)
      const available = parseBooleanValue(candidate.available)
      const galleryImagesRaw = Array.isArray(candidate.gallery_images) ? candidate.gallery_images : []
      const galleryImages = galleryImagesRaw
        .map((image) => {
          if (typeof image === 'string') {
            return image.trim() === '' ? null : image
          }
          if (image && typeof image === 'object') {
            const candidateUrl = (image as { url?: unknown }).url
            return typeof candidateUrl === 'string' && candidateUrl.trim() !== '' ? candidateUrl : null
          }
          return null
        })
        .filter((url): url is string => url !== null)

      return {
        id,
        color,
        price,
        available,
        gallery_images: galleryImages,
      }
    }

    const colorPrices = productAcfData?.color_prices
    const productColorPricesRaw = Array.isArray(colorPrices)
      ? (colorPrices as unknown[])
      : []

    const productColorPrices: NormalizedColorOption[] = productColorPricesRaw
      .map(normalizeProductColorOption)
      .filter((option): option is NormalizedColorOption => option !== null)

    const normalizedEntryOption = normalizeColorOption(entry.color_option)
    const colorOptionId =
      typeof rawOptionId === 'number'
        ? (Number.isFinite(rawOptionId) ? rawOptionId : null)
        : (typeof rawOptionId === 'string'
          ? (Number.isFinite(Number(rawOptionId)) ? Number(rawOptionId) : null)
          : null)

    const findById = (id: number | null) => {
      if (id === null) {
        return null
      }
      return productColorPrices.find(option => option.id === id) ?? null
    }

    const findByColor = (color: string | null) => {
      if (!color) {
        return null
      }
      const lowered = color.toLowerCase()
      return productColorPrices.find(option => option.color?.toLowerCase() === lowered) ?? null
    }

    const normalizedOptionId =
      normalizedEntryOption && normalizedEntryOption.id !== null
        ? normalizedEntryOption.id
        : null

    const selectedOption =
      findById(colorOptionId) ??
      (normalizedOptionId !== null ? findById(normalizedOptionId) : null) ??
      normalizedEntryOption ??
      findByColor(entry.color ?? null) ??
      (productColorPrices.length === 1 ? productColorPrices[0] : null)

    const rawColor = entry.color ?? null
    const sanitizedEntryColor = typeof rawColor === 'string' && !rawColor.startsWith('member.')
      ? rawColor
      : null
    const colorLabel = sanitizedEntryColor
      ?? selectedOption?.color
      ?? normalizedEntryOption?.color
      ?? (typeof rawColor === 'string' ? rawColor : null)

    const minPrice = productColorPrices.reduce<number | null>((acc, option) => {
      if (acc === null) {
        return option.price
      }
      return Math.min(acc, option.price)
    }, null)

    const productPrice = (product as { price?: unknown }).price
    const fallbackProductPrice = parseNumericValue(productPrice)

    const displayPrice = selectedOption?.price
      ?? normalizedEntryOption?.price
      ?? (minPrice ?? undefined)
      ?? fallbackProductPrice

    const availableAny = productColorPrices.length > 0
      ? productColorPrices.some(option => option.available)
      : parseBooleanValue((product as { is_available?: unknown }).is_available ?? true)

    const isAvailable = selectedOption
      ? selectedOption.available
      : parseBooleanValue((product as { is_available?: unknown }).is_available ?? availableAny)

    const normalizedSelectedOption = selectedOption
      ? {
          id: selectedOption.id,
          color: selectedOption.color ?? colorLabel ?? null,
          price: selectedOption.price,
          available: selectedOption.available,
          gallery_images: selectedOption.gallery_images,
        }
      : normalizedEntryOption
        ? {
            id: normalizedEntryOption.id,
            color: normalizedEntryOption.color ?? colorLabel ?? null,
            price: normalizedEntryOption.price,
            available: normalizedEntryOption.available,
            gallery_images: normalizedEntryOption.gallery_images,
          }
        : null

    const colorKey =
      colorOptionId !== null
        ? `color-option:${colorOptionId}`
        : normalizedSelectedOption?.id !== null && normalizedSelectedOption?.id !== undefined
          ? `color-option:${normalizedSelectedOption.id}`
          : (colorLabel ?? null)

    const minPriceValue = minPrice ?? displayPrice

    return {
      id: String(entry.id),
      product_id: entry.product_id,
      product_color_option_id: colorOptionId,
      color: colorLabel,
      color_key: colorKey,
      added_at: Number.isNaN(addedAt) ? Date.now() : addedAt,
      product: product.id
        ? {
            id: productIdValue,
            slug: productSlug,
            title: productTitle,
            featured_image_url: normalizedFeaturedImage,
            gallery_urls: galleryUrls,
            excerpt: typeof product?.excerpt === 'string' ? product.excerpt : undefined,
            acf: productAcfData as NonNullable<WishlistItem['product']>['acf'],
            product_category: product?.product_category,
          }
        : undefined,
      price: {
        min_price: minPriceValue,
        available_any: availableAny,
        selected: normalizedSelectedOption
          ? {
              color: normalizedSelectedOption.color ?? '',
              price: normalizedSelectedOption.price,
              available: normalizedSelectedOption.available,
            }
          : undefined,
      },
      is_available: isAvailable,
      display_price: displayPrice,
      color_option: normalizedSelectedOption,
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
