# Cache Configuration System

This document explains the cache configuration system implemented for the ROIHIN Next.js application. The system provides environment-aware caching that disables cache in development and enables strategic caching in production.

## Overview

The cache configuration system is located in `/src/config/cache.config.ts` and provides:

- **Environment Detection**: Automatically detects `NODE_ENV` to determine caching behavior
- **Development Mode**: Disables all caching (revalidate: 0, no-cache headers)  
- **Production Mode**: Enables strategic caching with 5-minute revalidation periods
- **Type Safety**: Full TypeScript support with proper type exports
- **Consistent API**: Unified interface for fetch configs, route segments, and headers

## Key Features

### Environment-Based Configuration

```typescript
// Development: All caching disabled for better DX
if (NODE_ENV === 'development') {
  revalidate: 0
  cache: 'no-store'
  'Cache-Control': 'no-cache'
}

// Production: Strategic caching enabled
if (NODE_ENV === 'production') {
  revalidate: 300 // 5 minutes
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
}
```

### Content-Specific Cache Settings

- **Database Content**: 5 minutes (testimonials, site meta)
- **Blog Posts**: 5 minutes (frequently changing WordPress content)
- **Blog Categories**: 15 minutes (less frequently changing)
- **Static Content**: 24 hours (rarely changing assets)
- **API Responses**: 5 minutes (default for API routes)

## Implementation Examples

### 1. API Routes (Already Updated)

**Files Updated:**
- `/src/app/api/blog/posts/route.ts`
- `/src/app/api/blog/categories/route.ts`

```typescript
import { getFetchConfig, getCacheHeaders } from '@/config/cache.config'

// Fetch with environment-aware caching
const response = await fetch(url, {
  headers: { 'Content-Type': 'application/json' },
  ...getFetchConfig('blogPosts'), // Uses appropriate cache settings
})

// Response with consistent headers  
return NextResponse.json(data, {
  headers: getCacheHeaders('shortTerm'),
})
```

### 2. Page Route Segments (Already Updated)

**Files Updated:**
- `/src/app/page.tsx` (dynamic content)
- `/src/app/blog/page.tsx` (dynamic content)
- `/src/app/testimonial/page.tsx` (dynamic content)
- `/src/app/about/page.tsx` (semi-static content)
- `/src/app/personalized/page.tsx` (semi-static content)
- `/src/app/charmspacer/page.tsx` (semi-static content)

```typescript
import { routeConfig } from '@/config/cache.config'

// For dynamic pages (with database content)
export const revalidate = routeConfig.dynamic.revalidate // 0 in dev, 300s in prod

// For semi-static pages (less frequent updates)
export const revalidate = routeConfig.semiStatic.revalidate // 0 in dev, 900s in prod

// For static pages (rarely changing)
export const revalidate = routeConfig.static.revalidate // 0 in dev, 3600s in prod
```

### 3. Database Functions (Enhancement Example)

```typescript
// Example enhancement for database functions
import { getFetchConfig } from '@/config/cache.config'
import { unstable_cache } from 'next/cache'

// Wrap database functions with Next.js caching
export const getTestimonials = unstable_cache(
  getTestimonialsFromDb,
  ['testimonials'],
  {
    revalidate: cacheConfig.content.database.revalidate,
    tags: cacheConfig.content.database.tags,
  }
)
```

### 4. Custom Fetch Wrapper (Enhancement Example)

```typescript
// Example enhancement for external API calls
import { getFetchConfig } from '@/config/cache.config'

export async function fetchWordPressApi(endpoint: string) {
  return fetch(`${WORDPRESS_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...getFetchConfig('blogPosts'),
  })
}
```

## Configuration Reference

### Cache Durations

```typescript
const CACHE_DURATIONS = {
  SHORT: 300,    // 5 minutes
  MEDIUM: 900,   // 15 minutes  
  LONG: 3600,    // 1 hour
  STATIC: 86400, // 24 hours
}
```

### Content Types

```typescript
type CacheType = 
  | 'database'      // Database content (5min)
  | 'blogPosts'     // WordPress posts (5min)
  | 'blogCategories'// WordPress categories (15min)
  | 'static'        // Static assets (24hr)
  | 'api'           // General API responses (5min)
```

### Route Configurations

```typescript
const routeConfig = {
  dynamic: {        // For pages with frequently changing content
    revalidate: 0 | 300,  // 5 minutes in production
    dynamicParams: true,
  },
  semiStatic: {     // For pages with occasional updates
    revalidate: 0 | 900,  // 15 minutes in production
    dynamicParams: false,
  },
  static: {         // For rarely changing pages
    revalidate: 0 | 3600, // 1 hour in production
    dynamicParams: false,
  },
}
```

## Usage Functions

### `getFetchConfig(cacheType)`

Returns appropriate fetch configuration based on environment and content type.

```typescript
// Development
getFetchConfig('database') // { cache: 'no-store' }

// Production  
getFetchConfig('database') // { next: { revalidate: 300, tags: ['database'] } }
```

### `getCacheHeaders(type)`

Returns appropriate Cache-Control headers for API responses.

```typescript
// Development
getCacheHeaders('shortTerm') // { 'Cache-Control': 'no-cache' }

// Production
getCacheHeaders('shortTerm') // { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' }
```

### `withDevCacheOverride(config)`

Utility to conditionally disable cache in development.

```typescript
const config = withDevCacheOverride({
  next: { revalidate: 300 }
}) // Returns { cache: 'no-store' } in development
```

## Development vs Production Behavior

### Development Mode (`NODE_ENV=development`)
- **All caching disabled** for better developer experience
- Database queries always fresh
- API calls never cached
- Route segments revalidate on every request
- Cache headers set to `no-cache`

### Production Mode (`NODE_ENV=production`)
- **Strategic caching enabled** for performance
- Database content cached for 5 minutes
- Blog posts cached for 5 minutes
- Blog categories cached for 15 minutes
- Route segments cached based on content type
- Proper Cache-Control headers with stale-while-revalidate

## Files Modified

### Configuration Files
- `/src/config/cache.config.ts` - Main cache configuration
- `/src/config/cache.examples.ts` - Usage examples and documentation

### API Routes Updated
- `/src/app/api/blog/posts/route.ts` - WordPress posts API
- `/src/app/api/blog/categories/route.ts` - WordPress categories API

### Pages Updated  
- `/src/app/page.tsx` - Home page (dynamic)
- `/src/app/blog/page.tsx` - Blog listing (dynamic)
- `/src/app/testimonial/page.tsx` - Testimonials (dynamic)
- `/src/app/about/page.tsx` - About page (semi-static)
- `/src/app/personalized/page.tsx` - Personalized page (semi-static)
- `/src/app/charmspacer/page.tsx` - Products page (semi-static)

## Testing Cache Configuration

### Development Testing
```bash
# Start development server
npm run dev

# Check that cache is disabled
# - Network tab shows no cache hits
# - Data always fresh on refresh
# - No cache headers in responses
```

### Production Testing  
```bash
# Build and start production server
npm run build
npm run start

# Verify caching is working
# - Subsequent requests should be faster
# - Cache headers present in responses
# - Data updates after revalidation period
```

## Performance Impact

### Development
- **No performance impact** - caching disabled
- Fresh data on every request
- Better debugging experience

### Production
- **Significant performance improvement**
- Reduced database load
- Faster API responses
- Better user experience with stale-while-revalidate

## Future Enhancements

The cache configuration system is designed to be extensible:

1. **Additional Content Types**: Add new cache types to `cacheConfig.content`
2. **Custom Durations**: Modify durations in `CACHE_DURATIONS` 
3. **Advanced Caching**: Implement Redis or other cache layers
4. **Cache Invalidation**: Add tag-based cache invalidation
5. **Monitoring**: Add cache performance tracking

## Troubleshooting

### Cache Not Working in Development
This is expected behavior. Development mode disables all caching.

### Cache Not Working in Production
1. Verify `NODE_ENV=production` is set
2. Check that configuration is imported correctly
3. Verify fetch calls use `getFetchConfig()`
4. Check route segments export `revalidate` values

### TypeScript Errors
Ensure you're using the exported types:
- `CacheType` for content type parameters
- `CacheDuration` for duration values  
- `CacheHeaders` for header types

## Support

For questions about the cache configuration system, refer to:
- This documentation
- `/src/config/cache.examples.ts` for usage examples
- `/src/config/cache.config.ts` for implementation details