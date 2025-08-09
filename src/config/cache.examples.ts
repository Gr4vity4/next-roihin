/**
 * Cache Configuration Usage Examples
 * 
 * This file demonstrates how to use the cache configuration system
 * across different parts of the Next.js application.
 */

// Import types for examples (commented to avoid unused import warnings)
// import { getFetchConfig, getCacheHeaders, routeConfig, cacheConfig } from './cache.config'

// ==========================================
// 1. API Route Examples
// ==========================================

/**
 * Example: API route with fetch caching
 * File: /src/app/api/example/route.ts
 */
/*
import { NextResponse } from 'next/server'
import { getFetchConfig, getCacheHeaders } from '@/config/cache.config'

export async function GET() {
  try {
    // Fetch external data with cache configuration
    const response = await fetch('https://api.example.com/data', {
      headers: { 'Content-Type': 'application/json' },
      ...getFetchConfig('api'), // Uses environment-aware caching
    })

    const data = await response.json()

    return NextResponse.json(data, {
      headers: getCacheHeaders('shortTerm'), // 5min cache in prod, no-cache in dev
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { 
        status: 500,
        headers: getCacheHeaders('shortTerm'), // Consistent header handling
      }
    )
  }
}
*/

// ==========================================
// 2. Page Component Examples (Route Segments)
// ==========================================

/**
 * Example: Dynamic page with database content
 * File: /src/app/products/page.tsx
 */
/*
import { routeConfig } from '@/config/cache.config'

// Configure route segment caching
export const revalidate = routeConfig.dynamic.revalidate // 0 in dev, 300s in prod
export const dynamicParams = routeConfig.dynamic.dynamicParams

export default async function ProductsPage() {
  // Your component logic here
  return <div>Products Page</div>
}
*/

/**
 * Example: Semi-static page (less frequent updates)
 * File: /src/app/about/page.tsx
 */
/*
import { routeConfig } from '@/config/cache.config'

// Configure route segment caching for semi-static content
export const revalidate = routeConfig.semiStatic.revalidate // 0 in dev, 900s in prod
export const dynamicParams = routeConfig.semiStatic.dynamicParams

export default async function AboutPage() {
  // Your component logic here
  return <div>About Page</div>
}
*/

/**
 * Example: Static page (rarely changing content)
 * File: /src/app/terms/page.tsx
 */
/*
import { routeConfig } from '@/config/cache.config'

// Configure route segment caching for static content
export const revalidate = routeConfig.static.revalidate // 0 in dev, 3600s in prod
export const dynamicParams = routeConfig.static.dynamicParams

export default async function TermsPage() {
  // Your component logic here
  return <div>Terms Page</div>
}
*/

// ==========================================
// 3. Database Function Examples
// ==========================================

/**
 * Example: Enhanced database function with cache awareness
 * File: /src/lib/db/products.ts
 */
/*
import { cacheConfig } from '@/config/cache.config'
import { unstable_cache } from 'next/cache'

// Original database function
async function getProductsFromDb(): Promise<Product[]> {
  // Database query logic here
  return []
}

// Enhanced with Next.js caching (for Server Components)
export const getProducts = unstable_cache(
  getProductsFromDb,
  ['products'], // cache key
  {
    revalidate: cacheConfig.content.database.revalidate,
    tags: cacheConfig.content.database.tags,
  }
)
*/

// ==========================================
// 4. Fetch Wrapper Examples
// ==========================================

/**
 * Example: Custom fetch wrapper for external APIs
 */
/*
import { getFetchConfig } from '@/config/cache.config'

export async function fetchWordPressApi(endpoint: string, cacheType: 'blogPosts' | 'blogCategories' = 'blogPosts') {
  const response = await fetch(`${process.env.WORDPRESS_API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'ROIHIN-NextJS-App',
    },
    ...getFetchConfig(cacheType), // Environment-aware caching
  })

  if (!response.ok) {
    throw new Error(`WordPress API error: ${response.status}`)
  }

  return response.json()
}
*/

// ==========================================
// 5. Server Component Examples
// ==========================================

/**
 * Example: Server Component with cached data fetching
 * File: /src/components/ProductList.tsx
 */
/*
import { cacheConfig } from '@/config/cache.config'

// Development vs Production conditional rendering
export default async function ProductList() {
  // In development, always show cache status for debugging
  if (cacheConfig.isDevelopment) {
    console.log('ProductList: Cache disabled in development')
  }

  const products = await getProducts() // Uses cached function from above

  return (
    <div>
      {cacheConfig.isDevelopment && (
        <div className="p-2 bg-yellow-100 text-xs">
          🔄 Dev Mode: Cache disabled - revalidate: {cacheConfig.content.database.revalidate}
        </div>
      )}
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
*/

// ==========================================
// 6. Middleware Examples
// ==========================================

/**
 * Example: Middleware with cache headers
 * File: /src/middleware.ts
 */
/*
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getCacheHeaders } from '@/config/cache.config'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Add cache headers for static assets
  if (request.nextUrl.pathname.startsWith('/api/static/')) {
    const headers = getCacheHeaders('longTerm')
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
  }

  return response
}
*/

// ==========================================
// 7. Environment-Specific Logic Examples
// ==========================================

/**
 * Example: Conditional behavior based on environment
 */
/*
import { cacheConfig } from '@/config/cache.config'

export function logCacheStatus(operation: string) {
  if (cacheConfig.isDevelopment) {
    console.log(`🔄 ${operation}: Cache disabled in development`)
  } else {
    console.log(`⚡ ${operation}: Cache enabled in production`)
  }
}

export function shouldRefreshData(): boolean {
  // Always refresh in development, use cache in production
  return cacheConfig.isDevelopment
}
*/

// ==========================================
// 8. Testing Examples
// ==========================================

/**
 * Example: Testing cache configuration
 * File: /src/__tests__/cache.test.ts
 */
/*
import { cacheConfig, getFetchConfig, getCacheHeaders } from '@/config/cache.config'

describe('Cache Configuration', () => {
  describe('Development Environment', () => {
    beforeAll(() => {
      process.env.NODE_ENV = 'development'
    })

    test('should disable cache in development', () => {
      const config = getFetchConfig('database')
      expect(config).toEqual({ cache: 'no-store' })
    })

    test('should return no-cache headers in development', () => {
      const headers = getCacheHeaders('shortTerm')
      expect(headers['Cache-Control']).toBe('no-cache')
    })
  })

  describe('Production Environment', () => {
    beforeAll(() => {
      process.env.NODE_ENV = 'production'
    })

    test('should enable cache in production', () => {
      const config = getFetchConfig('database')
      expect(config.next?.revalidate).toBe(300) // 5 minutes
    })

    test('should return proper cache headers in production', () => {
      const headers = getCacheHeaders('shortTerm')
      expect(headers['Cache-Control']).toContain('public, s-maxage=300')
    })
  })
})
*/

// ==========================================
// 9. Migration Examples
// ==========================================

/**
 * Example: Migrating existing code to use cache config
 */

// BEFORE: Hardcoded cache settings
/*
const response = await fetch(url, {
  next: { revalidate: 300 }
})
*/

// AFTER: Using cache configuration
/*
import { getFetchConfig } from '@/config/cache.config'

const response = await fetch(url, {
  ...getFetchConfig('api')
})
*/

// BEFORE: Hardcoded route segment config
/*
export const revalidate = 300
*/

// AFTER: Using cache configuration
/*
import { routeConfig } from '@/config/cache.config'

export const revalidate = routeConfig.dynamic.revalidate
*/

// ==========================================
// 10. Performance Monitoring Examples
// ==========================================

/**
 * Example: Cache performance monitoring
 */
/*
import { cacheConfig } from '@/config/cache.config'

export function trackCachePerformance(cacheType: string, hit: boolean) {
  if (cacheConfig.isDevelopment) {
    console.log(`📊 Cache ${hit ? 'HIT' : 'MISS'} for ${cacheType}`)
  }
  
  // In production, you could send this to analytics
  // analytics.track('cache_performance', { cacheType, hit })
}
*/

// Export for documentation purposes
const cacheExamples = {
  message: 'This file contains examples of how to use the cache configuration system',
  documentation: 'See comments above for usage patterns',
}

export default cacheExamples