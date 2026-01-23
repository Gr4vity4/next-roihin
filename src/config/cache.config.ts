/**
 * Cache Configuration System
 * 
 * Environment-aware caching configuration for Next.js application.
 * - Development: Disables caching for better development experience
 * - Cache disabled flag: Disables caching regardless of environment
 * - Production: Implements strategic caching for performance optimization
 */

// Cache duration constants (in seconds)
const CACHE_DURATIONS = {
  // Short-term cache for frequently changing content
  SHORT: 300, // 5 minutes
  
  // Moderate cache for regularly changing content
  MODERATE: 600, // 10 minutes

  // Medium-term cache for moderately stable content  
  MEDIUM: 900, // 15 minutes
  
  // Long-term cache for stable content
  LONG: 3600, // 1 hour
  
  // Very long-term cache for rarely changing content
  STATIC: 86400, // 24 hours
} as const

// Environment detection
const isDevelopment = process.env.NODE_ENV === 'development'
const isProduction = process.env.NODE_ENV === 'production'
// Set NEXT_PUBLIC_DISABLE_CACHE or DISABLE_CACHE to 'true' to disable caching.
const isCacheDisabled =
  process.env.NEXT_PUBLIC_DISABLE_CACHE === 'true' ||
  process.env.DISABLE_CACHE === 'true'
const shouldBypassCache = isDevelopment || isCacheDisabled
const NO_CACHE_HEADER = 'no-cache, no-store, must-revalidate'

/**
 * Cache configuration for different content types
 */
export const cacheConfig = {
  // Environment flags
  isDevelopment,
  isProduction,
  isCacheDisabled,
  
  // Raw duration constants
  durations: CACHE_DURATIONS,
  
  // Content-specific cache settings
  content: {
    // Database content (testimonials, site meta)
    database: {
      revalidate: shouldBypassCache ? 0 : CACHE_DURATIONS.SHORT, // 5 minutes in production
      tags: ['database'] as string[],
    },
    
    // Blog posts from WordPress API
    blogPosts: {
      revalidate: shouldBypassCache ? 0 : CACHE_DURATIONS.SHORT, // 5 minutes in production
      tags: ['blog', 'posts'] as string[],
    },
    
    // Blog categories (less frequently changing)
    blogCategories: {
      revalidate: shouldBypassCache ? 0 : CACHE_DURATIONS.MEDIUM, // 15 minutes in production
      tags: ['blog', 'categories'] as string[],
    },
    
    // Static content (images, assets)
    static: {
      revalidate: shouldBypassCache ? 0 : CACHE_DURATIONS.STATIC, // 24 hours in production
      tags: ['static'] as string[],
    },
    
    // API responses
    api: {
      revalidate: shouldBypassCache ? 0 : CACHE_DURATIONS.SHORT, // 5 minutes in production
      tags: ['api'] as string[],
    },
    
    // Site settings from WordPress
    siteSettings: {
      revalidate: shouldBypassCache ? 0 : CACHE_DURATIONS.LONG, // 1 hour in production
      tags: ['site-settings'] as string[],
    },
    
    // Testimonials from WordPress
    testimonials: {
      revalidate: shouldBypassCache ? 0 : CACHE_DURATIONS.MEDIUM, // 15 minutes in production
      tags: ['testimonials'] as string[],
    },

    // Gallery photos from WordPress
    gallery: {
      revalidate: shouldBypassCache ? 0 : CACHE_DURATIONS.SHORT, // 5 minutes in production
      tags: ['gallery', 'photos'] as string[],
    },

    // Crystal products from WordPress
    crystals: {
      revalidate: shouldBypassCache ? 0 : CACHE_DURATIONS.SHORT, // 5 minutes in production
      tags: ['crystals', 'products'] as string[],
    },
  },
  
  // HTTP Cache-Control headers for API routes
  headers: {
    // No cache for development
    noCache: NO_CACHE_HEADER,
    
    // Short-term cache with stale-while-revalidate
    shortTerm: shouldBypassCache 
      ? NO_CACHE_HEADER 
      : `public, s-maxage=${CACHE_DURATIONS.SHORT}, stale-while-revalidate=${CACHE_DURATIONS.SHORT * 2}`,
    
    // Medium-term cache with stale-while-revalidate  
    mediumTerm: shouldBypassCache
      ? NO_CACHE_HEADER
      : `public, s-maxage=${CACHE_DURATIONS.MEDIUM}, stale-while-revalidate=${CACHE_DURATIONS.MEDIUM * 2}`,
    
    // Long-term cache with stale-while-revalidate
    longTerm: shouldBypassCache
      ? NO_CACHE_HEADER
      : `public, s-maxage=${CACHE_DURATIONS.LONG}, stale-while-revalidate=${CACHE_DURATIONS.LONG * 2}`,
  },
} as const

/**
 * Route segment configuration for Next.js pages
 */
export const routeConfig = {
  // Dynamic pages that need frequent updates
  dynamic: {
    revalidate: shouldBypassCache ? 0 : CACHE_DURATIONS.SHORT,
    dynamicParams: true,
  },
  
  // Semi-static pages
  semiStatic: {
    revalidate: shouldBypassCache ? 0 : CACHE_DURATIONS.MEDIUM,
    dynamicParams: false,
  },
  
  // Static pages
  static: {
    revalidate: shouldBypassCache ? 0 : CACHE_DURATIONS.LONG,
    dynamicParams: false,
  },
} as const

/**
 * Fetch configuration helper for data fetching functions
 */
export function getFetchConfig(cacheType: keyof typeof cacheConfig.content) {
  const config = cacheConfig.content[cacheType]
  
  if (shouldBypassCache) {
    return {
      cache: 'no-store' as const,
    }
  }
  
  return {
    next: {
      revalidate: config.revalidate,
      tags: config.tags,
    },
  }
}

/**
 * Helper to get Cache-Control header based on content type
 */
export function getCacheHeaders(
  type: 'noCache' | 'shortTerm' | 'mediumTerm' | 'longTerm' = 'shortTerm'
): Record<string, string> {
  return {
    'Cache-Control': cacheConfig.headers[type],
  }
}

/**
 * Cache override utility
 * Use this when you need to temporarily disable cache in development or via env flag
 */
export function withDevCacheOverride<T extends Record<string, unknown>>(
  config: T
): T | { cache: 'no-store' } {
  if (shouldBypassCache) {
    return { cache: 'no-store' as const }
  }
  return config
}

// Type exports for TypeScript support
export type CacheType = keyof typeof cacheConfig.content
export type CacheDuration = typeof CACHE_DURATIONS[keyof typeof CACHE_DURATIONS]
export type CacheHeaders = keyof typeof cacheConfig.headers

// Export revalidate values directly for Next.js page configurations
// Next.js requires these to be static values, not member expressions
export const REVALIDATE_DYNAMIC = shouldBypassCache ? 0 : CACHE_DURATIONS.SHORT
export const REVALIDATE_10_MIN = shouldBypassCache ? 0 : CACHE_DURATIONS.MODERATE
export const REVALIDATE_SEMI_STATIC = shouldBypassCache ? 0 : CACHE_DURATIONS.MEDIUM
export const REVALIDATE_STATIC = shouldBypassCache ? 0 : CACHE_DURATIONS.LONG
