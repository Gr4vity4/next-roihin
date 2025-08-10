# Static Type TODO List

This document lists areas where static TypeScript types can be improved or where type safety enhancements are needed.

## WordPress API Types

### 1. Avatar URL Resolution
**File:** `/src/app/api/testimonials/route.ts` (line 47-50)
**Issue:** Avatar ID needs to be converted to actual image URL. Currently using placeholder pattern.
**TODO:** Implement proper media URL fetching from WordPress API or update testimonial ACF to include full image URLs.

### 2. Date Formatting Type Safety
**File:** `/src/app/api/testimonials/route.ts` (line 76-91)
**Issue:** Date string parsing and formatting lacks type safety
**TODO:** Add proper date validation and type-safe date formatting utilities

## API Helper Functions

### 3. Language Parameter Usage
**Files:** 
- `/src/lib/api/site-settings.ts` (lines 55, 65)
- `/src/app/api/testimonials/route.ts` (line 20)

**Issue:** Language parameter is accepted but not used (WordPress API doesn't support language filtering in current implementation)
**TODO:** Either remove the parameter or implement proper language filtering logic

## Component Props

### 4. Unused Props in GallerySection
**File:** `/src/components/sections/GallerySection.tsx` (lines 25-26, 30-31)
**Issue:** Props defined but never used:
- `backgroundImage`
- `backgroundAlt`
- `overlayOpacity`
- `parallaxSpeed`

**TODO:** Either implement the functionality for these props or remove them from the interface

## Type Inference Improvements

### 5. Zod Schema Type Inference
**Files:**
- `/src/lib/types/wordpress-settings.ts`
- `/src/lib/types/wordpress.ts`

**TODO:** Consider using more specific Zod types:
- Use `z.date()` instead of `z.string()` for dates
- Use `z.url()` instead of `z.string()` for URLs
- Use `z.email()` instead of `z.string()` for email addresses

### 6. API Response Type Guards
**TODO:** Add runtime type guards for API responses to ensure type safety at runtime:
```typescript
function isTestimonialResponse(data: unknown): data is TestimonialsResponse {
  // Implementation needed
}
```

## Cache Configuration Types

### 7. Route Revalidation Types
**Files:** All page components (`/src/app/*/page.tsx`)
**Issue:** Revalidate values are hardcoded numbers without type safety
**TODO:** Create a type-safe constant enum or object for revalidation values:
```typescript
const REVALIDATION_TIMES = {
  DYNAMIC: 300,    // 5 minutes
  SEMI_STATIC: 900, // 15 minutes
  STATIC: 3600     // 1 hour
} as const
```

## Error Handling Types

### 8. Error Response Types
**TODO:** Create consistent error response types across all API endpoints:
```typescript
interface ApiErrorResponse {
  error: string
  message?: string
  status: number
  timestamp: string
}
```

## Environment Variable Types

### 9. Type-Safe Environment Variables
**TODO:** Create a typed environment configuration:
```typescript
interface EnvironmentVariables {
  WORDPRESS_API_URL: string
  WORDPRESS_API_BASE_PATH: string
  JWT_SECRET: string
  NEXT_PUBLIC_API_URL: string
  NODE_ENV: 'development' | 'production' | 'test'
}
```

## Recommendations

1. **Use TypeScript strict mode** - Already enabled, ensure all new code follows strict type checking
2. **Add JSDoc comments** - For complex types and functions to improve IDE support
3. **Consider using type predicates** - For runtime type checking of external API responses
4. **Implement branded types** - For IDs and other primitive types that shouldn't be interchangeable
5. **Add exhaustive type checking** - Use never type for switch statements to ensure all cases are handled

## Priority Order

1. High: Fix unused parameters and props (items 3, 4)
2. Medium: Improve type safety for API responses (items 1, 2, 5, 6, 8)
3. Low: Enhance development experience (items 7, 9)

## Notes

- All TypeScript improvements should maintain backward compatibility
- Focus on runtime safety for external data sources (WordPress API)
- Consider performance implications of runtime type checking
- Update tests when modifying types (if tests exist)