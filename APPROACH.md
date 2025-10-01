# Code Architecture & Best Practices

This document outlines architectural patterns and best practices discovered during codebase refactoring. Following these guidelines will help maintain code quality and prevent common anti-patterns.

---

## Table of Contents

1. [Configuration Management](#1-configuration-management)
2. [API Route Patterns](#2-api-route-patterns)
3. [Error Handling](#3-error-handling)
4. [Authentication & Authorization](#4-authentication--authorization)
5. [Code Duplication Prevention](#5-code-duplication-prevention)
6. [TypeScript Best Practices](#6-typescript-best-practices)
7. [Testing & Verification](#7-testing--verification)

---

## 1. Configuration Management

### ❌ Anti-Pattern: Scattered Environment Variables

**Problem Found:**
```typescript
// In 13+ different files:
const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL || 'https://wp-roihin.precisiondevlab.com'
const API_BASE_PATH = process.env.WORDPRESS_API_BASE_PATH || '/wp-json/wp/v2'
```

**Issues:**
- Duplicate code across multiple files
- Inconsistent fallback values
- Hard to update when API changes
- No single source of truth

### ✅ Solution: Centralized Configuration

**Create `/src/config/api.config.ts`:**
```typescript
/**
 * Centralized API Configuration
 */
export const WORDPRESS_API_URL =
  process.env.WORDPRESS_API_URL ||
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
  'https://wp-roihin.precisiondevlab.com'

export const WORDPRESS_API_BASE_PATH =
  process.env.WORDPRESS_API_BASE_PATH ||
  '/wp-json/wp/v2'

export function getWordPressApiUrl(language?: 'en' | 'th'): string {
  const langPrefix = language === 'th' ? '/th' : ''
  return `${WORDPRESS_API_URL}${langPrefix}`
}

export function getApiBasePath(): string {
  return WORDPRESS_API_BASE_PATH
}
```

**Usage in files:**
```typescript
import { WORDPRESS_API_URL, getWordPressApiUrl } from '@/config/api.config'

// Use it directly
const response = await fetch(`${WORDPRESS_API_URL}/wp-json/...`)

// Or with language support
const apiUrl = getWordPressApiUrl('th')
```

**Benefits:**
- ✅ Single source of truth
- ✅ Easy to update across entire codebase
- ✅ Type-safe helper functions
- ✅ Consistent fallback values

**Rule:** Never directly use `process.env.WORDPRESS_API_URL` in business logic files. Always import from centralized config.

---

## 2. API Route Patterns

### ❌ Anti-Pattern: Duplicate API Routes

**Problem Found:**
```
/api/wishlist/is-favorite/route.ts
/api/wishlist/check-favorite/route.ts
```

Both routes did exactly the same thing, calling the same backend function.

**Issues:**
- Confusion about which route to use
- Maintenance burden (update both)
- Larger bundle size
- Client code inconsistency

### ✅ Solution: Single Responsibility Routes

**Before removal, verify:**
1. Check which route is actually used in client code
   ```bash
   grep -r "wishlist/is-favorite" src/
   grep -r "wishlist/check-favorite" src/
   ```

2. Keep the more descriptive route name
3. Delete the unused route
4. Update any references

**Rule:** One endpoint = One route. If you need multiple endpoints, they should have different functionality.

### ❌ Anti-Pattern: Inconsistent Response Patterns

**Problem Found:**
```typescript
// Some routes use:
return Response.json({ data })

// Others use:
return NextResponse.json({ data })

// Others use:
return new Response(JSON.stringify({ data }), { status: 200 })
```

### ✅ Solution: Standardize on NextResponse

**Always use NextResponse.json():**
```typescript
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const data = await fetchData()
    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    )
  }
}
```

**Benefits:**
- ✅ Consistent across all API routes
- ✅ Better TypeScript support
- ✅ Easier to maintain
- ✅ Next.js recommended pattern

**Rule:** Always import and use `NextResponse` from `next/server` in API routes.

---

## 3. Error Handling

### ❌ Anti-Pattern: Repeated Error Handling Logic

**Problem Found:**
```typescript
// Repeated 8+ times across contexts:
catch (err) {
  setError(err instanceof Error ? err.message : 'Failed to fetch wishlist')
  throw err
}

catch (err) {
  setError(err instanceof Error ? err.message : 'Failed to add item')
  throw err
}
```

**Issues:**
- Code duplication
- Inconsistent error messages
- Hard to update error handling globally

### ✅ Solution: Centralized Error Utilities

**Create `/src/lib/utils/error-handler.ts`:**
```typescript
/**
 * Extract a user-friendly error message from unknown error types
 */
export function getErrorMessage(error: unknown, fallbackMessage: string): string {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }

  return fallbackMessage
}

/**
 * Create a standardized error response object
 */
export function createErrorResponse(error: unknown, defaultMessage: string) {
  return {
    error: getErrorMessage(error, defaultMessage)
  }
}

/**
 * Log error with context
 */
export function logError(context: string, error: unknown, additionalInfo?: Record<string, unknown>) {
  console.error(`[${context}]`, error, additionalInfo ? additionalInfo : '')
}
```

**Usage:**
```typescript
import { getErrorMessage, logError } from '@/lib/utils/error-handler'

try {
  await fetchWishlist()
} catch (err) {
  logError('WishlistContext', err, { userId: user.id })
  setError(getErrorMessage(err, 'Failed to fetch wishlist'))
  throw err
}
```

**Benefits:**
- ✅ DRY principle (Don't Repeat Yourself)
- ✅ Consistent error handling
- ✅ Better debugging with context
- ✅ Type-safe error extraction

**Rule:** Never use `err instanceof Error ? err.message : 'fallback'` directly. Always use `getErrorMessage()`.

---

## 4. Authentication & Authorization

### ❌ Anti-Pattern: Duplicate Auth Token Retrieval

**Problem Found:**
```typescript
// In addresses.ts:
async function getAuthToken() {
  const cookieStore = await cookies()
  return cookieStore.get('wpToken')?.value
}

// In profile.ts:
async function getAuthToken() {
  const cookieStore = await cookies()
  return cookieStore.get('wpToken')?.value
}

// Already existed in lib/auth/get-token.ts
```

**Issues:**
- Multiple implementations of same logic
- Hard to update token handling globally
- Inconsistency risk

### ✅ Solution: Centralized Auth Token Function

**Single source: `/src/lib/auth/get-token.ts`:**
```typescript
import { cookies } from 'next/headers'

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get('wpToken')?.value || null
}
```

**Usage everywhere:**
```typescript
import { getAuthToken } from '@/lib/auth/get-token'

export async function listAddresses() {
  const token = await getAuthToken()

  if (!token) {
    throw new Error('No authentication token found')
  }

  // Use token...
}
```

**Benefits:**
- ✅ Single source of truth
- ✅ Easy to update token logic (e.g., add refresh token)
- ✅ Consistent error handling
- ✅ Better testability

**Rule:** Never create local `getAuthToken()` functions. Always import from `/lib/auth/get-token.ts`.

---

## 5. Code Duplication Prevention

### Best Practices Checklist

Before writing new code, ask yourself:

#### ✅ **Does this functionality already exist?**
```bash
# Search for similar code
grep -r "function fetchWishlist" src/
grep -r "WORDPRESS_API_URL" src/

# Use your IDE's "Find in Files" feature
```

#### ✅ **Can this be extracted into a utility?**

**If you write the same code 3+ times, extract it:**

```typescript
// ❌ Repeated pattern
const url1 = `${WORDPRESS_API_URL}/wp-json/roihin/v1/wishlist`
const url2 = `${WORDPRESS_API_URL}/wp-json/roihin/v1/orders`
const url3 = `${WORDPRESS_API_URL}/wp-json/roihin/v1/profile`

// ✅ Extracted utility
export function getApiEndpoint(path: string): string {
  return `${WORDPRESS_API_URL}${path}`
}

const url1 = getApiEndpoint('/wp-json/roihin/v1/wishlist')
const url2 = getApiEndpoint('/wp-json/roihin/v1/orders')
const url3 = getApiEndpoint('/wp-json/roihin/v1/profile')
```

#### ✅ **Should this be in a shared location?**

**Organize by scope:**
- `/config/*` - Configuration and constants
- `/lib/utils/*` - Shared utility functions
- `/lib/api/*` - API helper functions
- `/lib/auth/*` - Authentication utilities
- `/lib/types/*` - TypeScript type definitions

---

## 6. TypeScript Best Practices

### Use Centralized Type Definitions

**❌ Don't define the same interface in multiple files:**
```typescript
// In context file:
interface WishlistItem { id: string; product_id: number; ... }

// In API file:
interface WishlistItem { id: string; product_id: number; ... }
```

**✅ Define once in `/lib/types/`:**
```typescript
// /lib/types/wishlist.ts
export interface WishlistItem {
  id: string
  product_id: number
  color?: string
  added_at: number
}

// Import everywhere:
import type { WishlistItem } from '@/lib/types/wishlist'
```

### Strict Mode Compliance

The project uses TypeScript strict mode. Always:

- ✅ Define return types for functions
- ✅ Handle null/undefined cases explicitly
- ✅ Use proper type guards instead of `any`
- ✅ Validate API responses with Zod schemas

**Example:**
```typescript
// ❌ Avoid
async function getData() {
  const res = await fetch('/api/data')
  return res.json()
}

// ✅ Proper typing
async function getData(): Promise<DataResponse> {
  const res = await fetch('/api/data')
  const data = await res.json()

  // Validate with Zod
  return DataResponseSchema.parse(data)
}
```

---

## 7. Testing & Verification

### Always Verify Refactoring

**Before committing refactoring changes:**

```bash
# 1. Build the project
npm run build

# 2. Run linting
npm run lint

# 3. Run tests (if available)
npm run test

# 4. Test E2E critical paths
npm run test:e2e
```

### Search Before Deleting

**Before removing code/routes:**

```bash
# Check if code is referenced anywhere
grep -r "functionName" src/
grep -r "/api/route-to-delete" src/

# Check import statements
grep -r "from.*file-to-delete" src/
```

### Incremental Refactoring

**Don't refactor everything at once:**

1. ✅ Make small, focused changes
2. ✅ Test after each change
3. ✅ Commit frequently with clear messages
4. ✅ One concern per commit

**Good commit sequence:**
```
refactor: centralize API configuration
refactor: remove duplicate wishlist route
refactor: consolidate auth token retrieval
refactor: add error handler utility
```

**Bad commit:**
```
refactor: fix everything
```

---

## Common Anti-Patterns Summary

| ❌ Anti-Pattern | ✅ Solution | Location |
|----------------|-----------|----------|
| Scattered `process.env` usage | Centralized config | `/config/api.config.ts` |
| Duplicate API routes | Single route per function | Delete duplicates |
| `err instanceof Error ? err.message : 'msg'` | `getErrorMessage()` utility | `/lib/utils/error-handler.ts` |
| Multiple `getAuthToken()` functions | Import from central location | `/lib/auth/get-token.ts` |
| `Response.json()` vs `NextResponse.json()` | Always use `NextResponse` | All API routes |
| Duplicate type definitions | Centralized types | `/lib/types/*` |
| Helper functions in api-helper.ts | Move to config/api.config.ts | `/config/api.config.ts` |

---

## Quick Reference: File Organization

```
src/
├── config/              # Configuration files
│   ├── api.config.ts   # API URLs and endpoints
│   ├── cache.config.ts # Caching configuration
│   └── site.config.ts  # Site-wide settings
│
├── lib/
│   ├── api/            # API helper functions (server-side)
│   ├── auth/           # Authentication utilities
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Shared utility functions
│       └── error-handler.ts  # Error handling utilities
│
├── app/api/            # Next.js API routes
│   └── */route.ts      # Must use NextResponse.json()
│
└── contexts/           # React contexts
    └── *Context.tsx    # Use error-handler utilities
```

---

## Code Review Checklist

When reviewing PRs, check for:

- [ ] No duplicate `process.env` usage - use centralized config
- [ ] No duplicate functions - extract to utilities
- [ ] Consistent error handling with `getErrorMessage()`
- [ ] All API routes use `NextResponse.json()`
- [ ] No duplicate type definitions - use `/lib/types/`
- [ ] Auth token from centralized `getAuthToken()`
- [ ] Build passes: `npm run build`
- [ ] No breaking changes to UI/functionality

---

## Migration Guide for Existing Code

If you find code that doesn't follow these patterns:

### 1. **API Configuration**
```typescript
// Replace:
const API_URL = process.env.WORDPRESS_API_URL || 'https://...'

// With:
import { WORDPRESS_API_URL } from '@/config/api.config'
```

### 2. **Error Handling**
```typescript
// Replace:
catch (err) {
  setError(err instanceof Error ? err.message : 'Failed')
}

// With:
import { getErrorMessage } from '@/lib/utils/error-handler'

catch (err) {
  setError(getErrorMessage(err, 'Failed'))
}
```

### 3. **Auth Token**
```typescript
// Replace:
async function getAuthToken() {
  const cookieStore = await cookies()
  return cookieStore.get('wpToken')?.value
}

// With:
import { getAuthToken } from '@/lib/auth/get-token'
```

### 4. **API Responses**
```typescript
// Replace:
return Response.json({ data })

// With:
import { NextResponse } from 'next/server'
return NextResponse.json({ data })
```

---

## Questions?

If you're unsure about a pattern:

1. Check this document first
2. Search the codebase for similar code: `grep -r "pattern" src/`
3. Look in `/config/` and `/lib/utils/` for existing utilities
4. Ask the team before creating new patterns

---

**Document Version:** 1.0
**Last Updated:** 2025-10-01
**Based on:** Refactoring commit `ae18bcc`
