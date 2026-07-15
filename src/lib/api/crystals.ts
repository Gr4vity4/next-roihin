/**
 * Crystal API Helper Functions
 *
 * Functions to fetch crystal data from WordPress REST API via Next.js API routes
 */

import { getFetchConfig } from '@/config/cache.config'
import type {
  CrystalProduct,
  CrystalFilterParams,
  CrystalsAPIResponse,
  CrystalAPIResponse,
} from '@/lib/types/crystal'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

/**
 * Get all crystals with optional filters
 *
 * @param params - Filter parameters (language, page, search, filters, etc.)
 * @returns Paginated crystal list with metadata
 *
 * @example
 * ```typescript
 * const result = await getCrystals({
 *   lang: 'th',
 *   page: 1,
 *   per_page: 20,
 *   search: 'apatite',
 *   color_filter: 'blue,green',
 *   energy_properties: 'health_balance',
 * })
 * ```
 */
export async function getCrystals(
  params: CrystalFilterParams = {}
): Promise<CrystalsAPIResponse> {
  try {
    // Build query string from filter parameters
    const queryParams = new URLSearchParams()

    if (params.lang) queryParams.append('lang', params.lang)
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.per_page) queryParams.append('per_page', params.per_page.toString())
    if (params.search) queryParams.append('search', params.search)
    if (params.color_filter) queryParams.append('color_filter', params.color_filter)
    if (params.energy_properties) queryParams.append('energy_properties', params.energy_properties)
    if (params.zodiac_signs) queryParams.append('zodiac_signs', params.zodiac_signs)
    if (params.element_type) queryParams.append('element_type', params.element_type)

    const url = `${API_BASE_URL}/crystals${queryParams.toString() ? `?${queryParams.toString()}` : ''}`

    const response = await fetch(url, {
      ...getFetchConfig('api'),
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch crystals: ${response.status}`)
    }

    const data = await response.json()

    return {
      crystals: data.crystals || [],
      totalPages: data.totalPages || 1,
      currentPage: data.currentPage || 1,
      totalItems: data.totalItems,
    }
  } catch (error) {
    console.error('Error fetching crystals:', error)
    // Return empty result as fallback
    return {
      crystals: [],
      totalPages: 1,
      currentPage: 1,
      totalItems: 0,
    }
  }
}

/**
 * Get a single crystal by slug
 *
 * @param slug - Crystal slug (URL-friendly identifier)
 * @param lang - Language code (optional)
 * @returns Full crystal product data or null
 *
 * @example
 * ```typescript
 * const crystal = await getCrystalBySlug('apatite-1', 'th')
 * ```
 */
export async function getCrystalBySlug(
  slug: string,
  lang?: 'en' | 'th'
): Promise<CrystalProduct | null> {
  const queryParams = new URLSearchParams()
  if (lang) queryParams.append('lang', lang)

  const url = `${API_BASE_URL}/crystals/${slug}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`

  const response = await fetch(url, {
    ...getFetchConfig('api'),
  })

  if (!response.ok) {
    // Only a true 404 means the crystal doesn't exist; other failures must
    // surface as errors so callers don't render "not found" on a backend hiccup.
    if (response.status === 404) {
      return null
    }
    throw new Error(`Failed to fetch crystal: ${response.status}`)
  }

  const data: CrystalAPIResponse = await response.json()
  return data.crystal || null
}

/**
 * Search crystals by name
 *
 * @param query - Search query string
 * @param lang - Language code
 * @param page - Page number (default: 1)
 * @param perPage - Items per page (default: 20)
 * @returns Search results with pagination
 */
export async function searchCrystals(
  query: string,
  lang: 'en' | 'th' = 'th',
  page: number = 1,
  perPage: number = 20
): Promise<CrystalsAPIResponse> {
  return getCrystals({
    lang,
    page,
    per_page: perPage,
    search: query,
  })
}

/**
 * Get crystals filtered by color
 *
 * @param colors - Array of color filter values
 * @param lang - Language code
 * @param page - Page number
 * @returns Filtered crystal list
 */
export async function getCrystalsByColor(
  colors: string[],
  lang: 'en' | 'th' = 'th',
  page: number = 1
): Promise<CrystalsAPIResponse> {
  return getCrystals({
    lang,
    page,
    color_filter: colors.join(','),
  })
}

/**
 * Get crystals filtered by energy properties
 *
 * @param energyProps - Array of energy property values
 * @param lang - Language code
 * @param page - Page number
 * @returns Filtered crystal list
 */
export async function getCrystalsByEnergy(
  energyProps: string[],
  lang: 'en' | 'th' = 'th',
  page: number = 1
): Promise<CrystalsAPIResponse> {
  return getCrystals({
    lang,
    page,
    energy_properties: energyProps.join(','),
  })
}

/**
 * Get crystals filtered by zodiac signs
 *
 * @param zodiacSigns - Array of zodiac sign values
 * @param lang - Language code
 * @param page - Page number
 * @returns Filtered crystal list
 */
export async function getCrystalsByZodiac(
  zodiacSigns: string[],
  lang: 'en' | 'th' = 'th',
  page: number = 1
): Promise<CrystalsAPIResponse> {
  return getCrystals({
    lang,
    page,
    zodiac_signs: zodiacSigns.join(','),
  })
}

/**
 * Get crystals filtered by element type
 *
 * @param elements - Array of element values
 * @param lang - Language code
 * @param page - Page number
 * @returns Filtered crystal list
 */
export async function getCrystalsByElement(
  elements: string[],
  lang: 'en' | 'th' = 'th',
  page: number = 1
): Promise<CrystalsAPIResponse> {
  return getCrystals({
    lang,
    page,
    element_type: elements.join(','),
  })
}
