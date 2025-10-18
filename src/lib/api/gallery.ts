import { getFetchConfig } from '@/config/cache.config'
import { buildLaravelApiUrl } from '@/config/api.config'
import { LaravelSingleGalleryResponseSchema } from '@/lib/types/laravel'

/**
 * Get personalized gallery photos from Laravel API
 * @returns Array of image URLs
 */
export async function getPersonalizedGallery(): Promise<string[]> {
  try {
    const url = buildLaravelApiUrl('galleries/personalized')

    const response = await fetch(url, {
      ...getFetchConfig('gallery'),
    })

    if (!response.ok) {
      console.error(`Failed to fetch gallery photos: ${response.status} ${response.statusText}`)
      return []
    }

    const data = await response.json()

    // Validate response with Zod schema
    const validatedData = LaravelSingleGalleryResponseSchema.safeParse(data)

    if (!validatedData.success) {
      console.error('Invalid gallery response format:', validatedData.error)
      return []
    }

    // Extract image URLs from gallery images
    if (validatedData.data.data.images && validatedData.data.data.images.length > 0) {
      return validatedData.data.data.images.map(img => img.image_url)
    }

    return []
  } catch (error) {
    console.error('Error fetching gallery photos:', error)
    return []
  }
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
 * Uses the "inspired" gallery for recent designs
 * @param count Number of photos to select (default: 8)
 * @returns Array of randomly selected image URLs
 */
export async function getRecentPersonalizedDesigns(count: number = 8): Promise<string[]> {
  try {
    const url = buildLaravelApiUrl('galleries/inspired')

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

    // Extract image URLs from gallery images
    if (validatedData.data.data.images && validatedData.data.data.images.length > 0) {
      const allPhotos = validatedData.data.data.images.map(img => img.image_url)

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

    return []
  } catch (error) {
    console.error('Error fetching recent personalized designs:', error)
    return []
  }
}