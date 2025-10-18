/**
 * Centralized API Configuration
 *
 * This file contains all API-related constants and configuration.
 * Use these instead of directly accessing process.env in multiple places.
 */

/**
 * WordPress API Base URL (still used for blog, testimonials, galleries)
 * Default: https://wp-roihin.precisiondevlab.com
 */
export const WORDPRESS_API_URL =
  process.env.WORDPRESS_API_URL ||
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
  'https://wp-roihin.precisiondevlab.com'

/**
 * Laravel API Base URL
 * Default: http://localhost:8000
 */
export const LARAVEL_API_URL =
  process.env.LARAVEL_API_URL ||
  process.env.NEXT_PUBLIC_LARAVEL_API_URL ||
  'http://localhost:8000'

/**
 * Laravel API Base Path
 * Default: /api/v1
 */
export const LARAVEL_API_BASE_PATH = '/api/v1'

/**
 * WordPress API Base Path
 * Default: /wp-json/wp/v2
 */
export const WORDPRESS_API_BASE_PATH = process.env.WORDPRESS_API_BASE_PATH || '/wp-json/wp/v2'

/**
 * Get WordPress API URL with optional language prefix
 * @param language - Language code ('en' | 'th')
 * @returns WordPress API base URL
 */
export function getWordPressApiUrl(language?: 'en' | 'th'): string {
  const langPrefix = language === 'th' ? '/th' : ''
  return `${WORDPRESS_API_URL}${langPrefix}`
}

/**
 * Get WordPress API base path
 * @returns API base path
 */
export function getApiBasePath(): string {
  return WORDPRESS_API_BASE_PATH
}

/**
 * Get full Laravel API URL
 * @returns Full Laravel API base URL
 */
export function getLaravelApiUrl(): string {
  return LARAVEL_API_URL
}

/**
 * Get Laravel API endpoint URL
 * @param endpoint - API endpoint path (e.g., '/posts', '/testimonials')
 * @returns Full endpoint URL
 */
export function getLaravelApiEndpoint(endpoint: string): string {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
  return `${LARAVEL_API_URL}${LARAVEL_API_BASE_PATH}/${cleanEndpoint}`
}

/**
 * Build Laravel API URL with query parameters
 * @param endpoint - API endpoint path
 * @param params - Query parameters as key-value pairs
 * @returns Full URL with query string
 */
export function buildLaravelApiUrl(
  endpoint: string,
  params?: Record<string, string | number | boolean | string[] | undefined>
): string {
  const baseUrl = getLaravelApiEndpoint(endpoint)

  if (!params) {
    return baseUrl
  }

  const queryParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        // Handle array parameters (e.g., slugs[]=value1&slugs[]=value2)
        value.forEach(v => queryParams.append(`${key}[]`, String(v)))
      } else {
        queryParams.append(key, String(value))
      }
    }
  })

  const queryString = queryParams.toString()
  return queryString ? `${baseUrl}?${queryString}` : baseUrl
}
