import { getFetchConfig } from '@/config/cache.config'
import { PhotoGalleryResponseSchema } from '@/lib/types/gallery'

const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL || process.env.NEXT_PUBLIC_WORDPRESS_API_URL
const WORDPRESS_API_BASE_PATH = process.env.WORDPRESS_API_BASE_PATH || '/wp-json/wp/v2'

/**
 * Get personalized gallery photos from WordPress
 * @returns Array of image URLs
 */
export async function getPersonalizedGallery(): Promise<string[]> {
  try {
    const url = `${WORDPRESS_API_URL}${WORDPRESS_API_BASE_PATH}/photo?_fields=acf&uid=personalized`

    const response = await fetch(url, {
      ...getFetchConfig('gallery'),
    })

    if (!response.ok) {
      console.error(`Failed to fetch gallery photos: ${response.status} ${response.statusText}`)
      return []
    }

    const data = await response.json()

    // Validate response with Zod schema
    const validatedData = PhotoGalleryResponseSchema.safeParse(data)

    if (!validatedData.success) {
      console.error('Invalid gallery response format:', validatedData.error)
      return []
    }

    // Extract gallery URLs from first item if exists
    if (validatedData.data.length > 0 && validatedData.data[0].acf.gallery) {
      return validatedData.data[0].acf.gallery
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