export function getWordPressApiUrl(language: 'en' | 'th' = 'en'): string {
  const baseUrl = process.env.WORDPRESS_API_URL || 'https://wp-roihin.precisiondevlab.com'
  const langPrefix = language === 'th' ? '/th' : ''
  return `${baseUrl}${langPrefix}`
}

export function getApiBasePath(): string {
  return process.env.WORDPRESS_API_BASE_PATH || '/wp-json/wp/v2'
}