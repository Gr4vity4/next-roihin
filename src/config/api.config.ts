/**
 * Centralized API Configuration
 *
 * This file contains all API-related constants and configuration.
 * Use these instead of directly accessing process.env in multiple places.
 */

/**
 * WordPress API Base URL
 * Default: https://wp-roihin.precisiondevlab.com
 */
export const WORDPRESS_API_URL =
  process.env.WORDPRESS_API_URL ||
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
  'https://wp-roihin.precisiondevlab.com'

/**
 * WordPress API Base Path
 * Default: /wp-json/wp/v2
 */
export const WORDPRESS_API_BASE_PATH =
  process.env.WORDPRESS_API_BASE_PATH ||
  '/wp-json/wp/v2'

/**
 * Get full WordPress API URL with language support
 * @param language - Language code ('en' | 'th')
 * @returns Full API URL with language prefix if applicable
 */
export function getWordPressApiUrl(language?: 'en' | 'th'): string {
  const langPrefix = language === 'th' ? '/th' : ''
  return `${WORDPRESS_API_URL}${langPrefix}`
}

/**
 * Get WordPress API base path
 * @returns API base path (e.g., /wp-json/wp/v2)
 */
export function getApiBasePath(): string {
  return WORDPRESS_API_BASE_PATH
}

/**
 * Get WordPress API endpoint URL
 * @param endpoint - API endpoint path (e.g., '/wp-json/roihin/v1/wishlist')
 * @param language - Optional language code
 * @returns Full endpoint URL
 */
export function getApiEndpoint(endpoint: string, language?: 'en' | 'th'): string {
  const baseUrl = getWordPressApiUrl(language)
  return `${baseUrl}${endpoint}`
}
