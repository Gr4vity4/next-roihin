import { getFetchConfig } from '@/config/cache.config'
import type { Testimonial } from '@/lib/types/wordpress-settings'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

/**
 * Get all active testimonials
 * @param language - Language filter (optional)
 * @returns Array of testimonials
 */
export async function getTestimonials(language?: string): Promise<Testimonial[]> {
  try {
    const params = new URLSearchParams()
    if (language) {
      params.append('lang', language)
    }

    const url = `${API_BASE_URL}/testimonials${params.toString() ? `?${params.toString()}` : ''}`

    const response = await fetch(url, {
      ...getFetchConfig('testimonials'),
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch testimonials: ${response.status}`)
    }

    const data = await response.json()
    return data.testimonials || []
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    // Return empty array as fallback
    return []
  }
}

/**
 * Get a single testimonial by ID
 * @param id - Testimonial ID
 * @returns Testimonial or null
 */
export async function getTestimonialById(id: string): Promise<Testimonial | null> {
  try {
    const testimonials = await getTestimonials()
    return testimonials.find((t) => t.id === id) || null
  } catch (error) {
    console.error('Error fetching testimonial:', error)
    return null
  }
}