import { getFetchConfig } from '@/config/cache.config'
import { buildLaravelApiUrl } from '@/config/api.config'
import {
  LaravelSingleGalleryResponseSchema,
  type LaravelGalleryImage,
  type LaravelGalleryImageAsset,
} from '@/lib/types/laravel'

/**
 * Fetch gallery images by slug from the Laravel API.
 * Returns images sorted by admin-defined sort order.
 */
export async function getGalleryImagesBySlug(slug: string): Promise<LaravelGalleryImage[]> {
  try {
    const url = buildLaravelApiUrl(`galleries/${slug}`)

    const response = await fetch(url, {
      ...getFetchConfig('gallery'),
    })

    if (!response.ok) {
      console.error(`Failed to fetch ${slug} gallery: ${response.status} ${response.statusText}`)
      return []
    }

    const data = await response.json()

    const validatedData = LaravelSingleGalleryResponseSchema.safeParse(data)

    if (!validatedData.success) {
      console.error(`Invalid ${slug} gallery response format:`, validatedData.error)
      return []
    }

    const galleryImages = validatedData.data.data.images ?? []

    if (galleryImages.length === 0) {
      return []
    }

    return [...galleryImages].sort((a, b) => {
      const aOrder = typeof a.sort_order === 'number' ? a.sort_order : Number.MAX_SAFE_INTEGER
      const bOrder = typeof b.sort_order === 'number' ? b.sort_order : Number.MAX_SAFE_INTEGER
      return aOrder - bOrder
    })
  } catch (error) {
    console.error(`Error fetching ${slug} gallery:`, error)
    return []
  }
}

/**
 * Get curated personalized gallery images from Laravel API
 * @returns Array of gallery image objects
 */
export async function getPersonalizedGalleryImages(): Promise<LaravelGalleryImage[]> {
  return getGalleryImagesBySlug('personalized')
}

/**
 * Get personalized gallery photos from Laravel API
 * @returns Array of image URLs
 */
export async function getPersonalizedGallery(): Promise<string[]> {
  const images = await getPersonalizedGalleryImages()

  if (images.length === 0) {
    return []
  }

  return images
    .map(image => image.image_url)
    .filter((url): url is string => Boolean(url))
}

/**
 * Get random selection of gallery photos
 * @param count Number of photos to select
 * @returns Array of randomly selected image URLs
 */
export async function getRandomGalleryPhotos(count: number = 10): Promise<string[]> {
  const allPhotos = await getPersonalizedGallery()

  if (allPhotos.length === 0) {
    return []
  }

  // If we have fewer photos than requested, return all
  if (allPhotos.length <= count) {
    return [...allPhotos].sort(() => Math.random() - 0.5)
  }

  // Fisher-Yates shuffle algorithm for true randomization
  const shuffled = [...allPhotos]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  // Return first 'count' items from shuffled array
  return shuffled.slice(0, count)
}

/**
 * Get recent personalized bracelet designs from Laravel API
 * Uses the "recently-personalized" gallery managed in the admin CMS
 * @param count Number of photos to select (default: 8)
 * @returns Array of prioritized gallery image objects (sorted by sort order)
 */
export async function getRecentPersonalizedDesigns(count: number = 8): Promise<LaravelGalleryImage[]> {
  try {
    const url = buildLaravelApiUrl('galleries/recently-personalized')

    const response = await fetch(url, {
      ...getFetchConfig('gallery'),
    })

    if (!response.ok) {
      console.error(`Failed to fetch recent personalized designs: ${response.status} ${response.statusText}`)
      return []
    }

    const data = await response.json()

    // Validate response with Zod schema
    const validatedData = LaravelSingleGalleryResponseSchema.safeParse(data)

    if (!validatedData.success) {
      console.error('Invalid recent designs response format:', validatedData.error)
      return []
    }

    const galleryImages = validatedData.data.data.images ?? []

    if (galleryImages.length === 0) {
      return []
    }

    // Sort images by admin-defined sort order (ascending). Missing sort_order go last.
    const sortedByPriority = [...galleryImages].sort((a, b) => {
      const aOrder = typeof a.sort_order === 'number' ? a.sort_order : Number.MAX_SAFE_INTEGER
      const bOrder = typeof b.sort_order === 'number' ? b.sort_order : Number.MAX_SAFE_INTEGER
      return aOrder - bOrder
    })

    const prioritizedDesigns = sortedByPriority
      .filter(image => Boolean(image.image_url))
      .map<LaravelGalleryImage>((image) => ({
        ...image,
        sub_gallery: (image.sub_gallery ?? [])
          .slice()
          .sort((a: LaravelGalleryImageAsset, b: LaravelGalleryImageAsset) => {
            const aOrder = typeof a.sort_order === 'number' ? a.sort_order : Number.MAX_SAFE_INTEGER
            const bOrder = typeof b.sort_order === 'number' ? b.sort_order : Number.MAX_SAFE_INTEGER
            return aOrder - bOrder
          }),
      }))

    if (prioritizedDesigns.length === 0) {
      return []
    }

    // Respect requested count while preserving priority order
    return prioritizedDesigns.slice(0, count)
  } catch (error) {
    console.error('Error fetching recent personalized designs:', error)
    return []
  }
}

export async function getAllRecentPersonalizedDesigns(): Promise<LaravelGalleryImage[]> {
  return getRecentPersonalizedDesigns(Number.MAX_SAFE_INTEGER)
}
