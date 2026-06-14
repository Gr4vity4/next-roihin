import type { MetadataRoute } from 'next'

import { siteConfig } from '@/config/site.config'
import { routing } from '@/i18n/routing'

/**
 * robots.txt generator. Served at `/robots.txt`.
 *
 * Allows crawling of public content while keeping private (member area),
 * transactional (checkout), auth and demo routes out of search indexes for
 * every locale. Also advertises the sitemap location.
 */

const BASE_URL = siteConfig.url.replace(/\/$/, '')

// Path segments that should never be indexed, blocked across all locales.
const PRIVATE_SEGMENTS = ['member', 'checkout', 'reset-password', 'button-demo']

const localizedDisallow = routing.locales.flatMap((locale) =>
  PRIVATE_SEGMENTS.map((segment) => `/${locale}/${segment}`),
)

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', ...localizedDisallow],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
