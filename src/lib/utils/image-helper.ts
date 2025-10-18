/**
 * Get product image URL with fallback to default logo
 *
 * @param imageUrl - The product image URL (can be null, undefined, or empty string)
 * @returns The image URL or default logo path if no valid image URL is provided
 */
export function getProductImageUrl(imageUrl: string | null | undefined): string {
  // Return default logo if image URL is empty, null, or undefined
  if (!imageUrl || imageUrl.trim() === '') {
    return '/images/logo.avif'
  }
  return imageUrl
}
