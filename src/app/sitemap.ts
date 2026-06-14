import type { MetadataRoute } from 'next'

import { buildLaravelApiUrl } from '@/config/api.config'
import { getFetchConfig } from '@/config/cache.config'
import { SHOP_COLLECTIONS } from '@/config/shop.config'
import { siteConfig } from '@/config/site.config'
import { routing } from '@/i18n/routing'
import { normalizeCrystalCollection } from '@/lib/server/crystal-transform'

/**
 * Dynamic sitemap for the localized storefront.
 *
 * Strategy:
 * - Always emit the known public routes (marketing, listing and shop category
 *   pages) so the sitemap is valid even when the backend is unreachable.
 * - Best-effort enrich it with product, crystal and blog detail URLs pulled
 *   from the Laravel API. Every remote fetch is wrapped in try/catch, so a
 *   backend outage degrades gracefully to the static routes instead of failing
 *   the build/request.
 * - Each logical page is listed once (default locale URL) with `hreflang`
 *   alternates for every locale, following the Next.js i18n sitemap pattern.
 *
 * Served at `/sitemap.xml`.
 */

// Regenerate at most once per hour (ISR) so new products/posts appear without
// rebuilding, while keeping responses cheap for crawlers.
export const revalidate = 3600

const BASE_URL = siteConfig.url.replace(/\/$/, '')
const LOCALES = routing.locales
const DEFAULT_LOCALE = routing.defaultLocale

// Pagination guardrails for the backend fetches.
const PER_PAGE = 100
const MAX_PAGES = 20

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>

interface RouteDef {
  /** Path after the locale prefix, e.g. `/shop` or `/` for the homepage. */
  path: string
  changeFrequency?: ChangeFrequency
  priority?: number
  lastModified?: string | Date
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() !== '' ? value : undefined
}

function toLastModified(value?: string | Date): Date {
  if (value) {
    const date = new Date(value)
    if (!Number.isNaN(date.getTime())) {
      return date
    }
  }
  return new Date()
}

/** Build a single sitemap entry with hreflang alternates for every locale. */
function buildEntry(route: RouteDef): MetadataRoute.Sitemap[number] {
  const suffix = route.path === '/' ? '' : route.path
  const languages: Record<string, string> = {}

  for (const locale of LOCALES) {
    languages[locale] = `${BASE_URL}/${locale}${suffix}`
  }
  // Point search engines at the default locale when no language matches.
  languages['x-default'] = `${BASE_URL}/${DEFAULT_LOCALE}${suffix}`

  return {
    url: `${BASE_URL}/${DEFAULT_LOCALE}${suffix}`,
    lastModified: toLastModified(route.lastModified),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
    alternates: { languages },
  }
}

// ---------------------------------------------------------------------------
// Static, always-present public routes
// ---------------------------------------------------------------------------

const STATIC_ROUTES: RouteDef[] = [
  { path: '/', changeFrequency: 'daily', priority: 1 },
  { path: '/shop', changeFrequency: 'daily', priority: 0.9 },
  { path: '/shop/new-arrivals', changeFrequency: 'daily', priority: 0.8 },
  { path: '/crystal', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/charmspacer', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/personalized', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/personalized/recent-designs', changeFrequency: 'weekly', priority: 0.6 },
  { path: '/custom', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/custom/creations', changeFrequency: 'weekly', priority: 0.6 },
  { path: '/bracelet-order', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/blog', changeFrequency: 'daily', priority: 0.8 },
  { path: '/testimonial', changeFrequency: 'weekly', priority: 0.6 },
  { path: '/customer-service', changeFrequency: 'monthly', priority: 0.5 },
]

// Shop category landing pages (driven by static config — no backend needed).
const SHOP_CATEGORY_ROUTES: RouteDef[] = SHOP_COLLECTIONS.map((collection) => ({
  path: `/shop/${collection.slug}`,
  changeFrequency: 'weekly',
  priority: 0.7,
}))

// ---------------------------------------------------------------------------
// Dynamic routes (best-effort; failures degrade to static routes)
// ---------------------------------------------------------------------------

/** Paginate a Laravel list endpoint, collecting each page's `data` array. */
async function fetchAllPages(
  endpoint: string,
  params: Record<string, string | number>,
  cacheType: Parameters<typeof getFetchConfig>[0],
): Promise<Record<string, unknown>[]> {
  const records: Record<string, unknown>[] = []

  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const url = buildLaravelApiUrl(endpoint, { ...params, per_page: PER_PAGE, page })
    const response = await fetch(url, getFetchConfig(cacheType))

    if (!response.ok) {
      break
    }

    const payload = (await response.json()) as {
      data?: unknown
      meta?: { pagination?: { last_page?: number } }
    }
    const data = Array.isArray(payload.data) ? (payload.data as Record<string, unknown>[]) : []
    records.push(...data)

    const lastPage = payload.meta?.pagination?.last_page
    if (data.length < PER_PAGE || (typeof lastPage === 'number' && page >= lastPage)) {
      break
    }
  }

  return records
}

async function fetchProductRoutes(): Promise<RouteDef[]> {
  try {
    const products = await fetchAllPages('products', { locale: DEFAULT_LOCALE }, 'api')

    return products.flatMap((product) => {
      const slug = asString(product.slug)
      if (!slug) {
        return []
      }
      return [
        {
          path: `/shop/product/${encodeURIComponent(slug)}`,
          changeFrequency: 'weekly',
          priority: 0.6,
          lastModified: asString(product.updated_at) ?? asString(product.created_at),
        } satisfies RouteDef,
      ]
    })
  } catch (error) {
    console.error('[sitemap] Failed to load product routes:', error)
    return []
  }
}

async function fetchCrystalRoutes(): Promise<RouteDef[]> {
  try {
    const routes: RouteDef[] = []

    for (let page = 1; page <= MAX_PAGES; page += 1) {
      const url = buildLaravelApiUrl('/crystals', {
        locale: DEFAULT_LOCALE,
        lang: DEFAULT_LOCALE,
        per_page: PER_PAGE,
        page,
      })
      const response = await fetch(url, getFetchConfig('crystals'))
      if (!response.ok) {
        break
      }

      const payload = await response.json()
      const records = normalizeCrystalCollection(payload, DEFAULT_LOCALE)

      for (const record of records) {
        routes.push({
          path: `/crystal/${encodeURIComponent(record.slug)}`,
          changeFrequency: 'weekly',
          priority: 0.6,
        })
      }

      const lastPage = (payload as { meta?: { pagination?: { last_page?: number } } })?.meta
        ?.pagination?.last_page
      if (records.length < PER_PAGE || (typeof lastPage === 'number' && page >= lastPage)) {
        break
      }
    }

    return routes
  } catch (error) {
    console.error('[sitemap] Failed to load crystal routes:', error)
    return []
  }
}

async function fetchBlogRoutes(): Promise<RouteDef[]> {
  try {
    const posts = await fetchAllPages('posts', { locale: DEFAULT_LOCALE }, 'blogPosts')

    return posts.flatMap((post) => {
      const slug = asString(post.slug)
      if (!slug) {
        return []
      }
      return [
        {
          path: `/blog/${encodeURIComponent(slug)}`,
          changeFrequency: 'monthly',
          priority: 0.6,
          lastModified:
            asString(post.updated_at) ?? asString(post.published_at) ?? asString(post.created_at),
        } satisfies RouteDef,
      ]
    })
  } catch (error) {
    console.error('[sitemap] Failed to load blog routes:', error)
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productRoutes, crystalRoutes, blogRoutes] = await Promise.all([
    fetchProductRoutes(),
    fetchCrystalRoutes(),
    fetchBlogRoutes(),
  ])

  const allRoutes = [
    ...STATIC_ROUTES,
    ...SHOP_CATEGORY_ROUTES,
    ...productRoutes,
    ...crystalRoutes,
    ...blogRoutes,
  ]

  // De-duplicate by path; keep the first (richer/static) definition.
  const seen = new Set<string>()
  const uniqueRoutes = allRoutes.filter((route) => {
    if (seen.has(route.path)) {
      return false
    }
    seen.add(route.path)
    return true
  })

  return uniqueRoutes.map(buildEntry)
}
