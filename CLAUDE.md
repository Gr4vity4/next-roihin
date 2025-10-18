# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ROIHIN - A full-stack e-commerce platform for personalized stone bracelets with a decoupled architecture featuring a Next.js 15 front-end, Laravel 12 REST API back-end, and Stripe payments. The platform supports multi-language (Thai/English) content with database-driven translations.

## Code Architecture & Best Practices

**IMPORTANT**: This codebase follows strict architectural patterns documented in `/APPROACH.md`. You MUST read and follow these guidelines:

- **Configuration Management**: Use centralized config from `/src/config/api.config.ts` - never use scattered `process.env` calls
- **Error Handling**: Use utilities from `/src/lib/utils/error-handler.ts` - never inline `err instanceof Error` checks
- **Authentication**: Import `getAuthToken()` from `/src/lib/auth/get-token.ts` - never create local auth functions
- **API Responses**: Always use `NextResponse.json()` from `next/server` in API routes
- **Type Definitions**: Use centralized types from `/src/lib/types/` - avoid duplicate interfaces
- **Code Duplication**: Search for existing implementations before writing new code

Read `/APPROACH.md` for detailed examples, anti-patterns to avoid, and migration guides. Following these patterns is mandatory for maintaining code quality.

## Development Commands

```bash
# Development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint

# E2E Testing with Playwright
npm run test:e2e              # Run all tests
npm run test:e2e:ui           # Open Playwright UI mode
npm run test:e2e:debug        # Debug tests
npm run test:e2e:headed       # Run tests in headed mode
npm run test:e2e:report       # View test report
```

## Architecture

### Tech Stack

- **Framework**: Next.js 15.5 with App Router
- **Language**: TypeScript with strict mode
- **Internationalization**: next-intl for Thai/English support
- **Back-End API**: Laravel 12 REST API with Sanctum authentication
- **Styling**: Tailwind CSS v4 with custom Mixed Language font system
- **UI Components**: Radix UI primitives, Heroicons, Lucide icons
- **Data Validation**: Zod schemas for API responses
- **Payments**: Stripe integration for checkout and payment processing
- **Testing**: Playwright for E2E testing (Chromium & Mobile Safari)

### Project Structure

- `/src/app/[locale]/` - Internationalized Next.js App Router pages
- `/src/app/api/` - API proxy routes for Laravel back-end
- `/src/components/` - Reusable React components
- `/src/components/sections/` - Page-specific section components
- `/src/components/ui/` - UI primitives and utilities
- `/src/lib/api/` - API helper functions for Laravel integration
- `/src/lib/types/` - TypeScript type definitions
- `/src/config/` - **MANDATORY centralized configuration** (api.config.ts, cache.config.ts)
- `/src/contexts/` - React context providers (Auth, Cart, Wishlist)
- `/src/i18n/` - Internationalization configuration
- `/messages/` - Translation JSON files (en.json, th.json)
- `/public/images/` - Static images organized by feature

### Key Architectural Patterns

#### 1. Caching Strategy

The app uses environment-aware caching configured in `/src/config/cache.config.ts`:

- **Development**: All caching disabled for better DX
- **Production**: Strategic caching with 5-minute revalidation for dynamic content
- Use `getFetchConfig()` and `getCacheHeaders()` helpers for consistent caching

#### 2. Laravel Back-End Integration

All content managed through Laravel REST API (default: `http://localhost:8000`):

- Products: `/api/v1/products`
- Stones: `/api/v1/stones`
- Posts: `/api/v1/posts`
- Categories: `/api/v1/categories`
- Testimonials: `/api/v1/testimonials`
- Galleries: `/api/v1/galleries`
- Authentication: `/api/v1/auth/*`
- Wishlist: `/api/v1/wishlist`, `/api/v1/products/{id}/wishlist`
- Profile: `/api/v1/auth/me`

**IMPORTANT**: Always use `getLaravelApiEndpoint()` or `buildLaravelApiUrl()` from `/src/config/api.config.ts` - never hardcode API URLs.

#### 3. API Route Pattern

All API routes follow consistent patterns:

1. Use `getFetchConfig()` for cache configuration
2. Return `getCacheHeaders()` in responses
3. Validate with Zod schemas
4. Handle errors gracefully with fallbacks

#### 4. Internationalization

- Routes prefixed with `[locale]` parameter (en/th)
- Translations in `/messages/` directory
- Use `useTranslations()` hook for component translations
- Default locale: 'th', supported: ['th', 'en']

#### 5. Component Organization

- Page components use server components by default
- Loading states implemented with loading.tsx files
- Error boundaries for graceful error handling
- Suspense boundaries for optimal streaming
- Client components marked with 'use client' directive

## Environment Variables

Required in `.env.local`:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Laravel API Configuration (optional - defaults to http://localhost:8000)
LARAVEL_API_URL=http://localhost:8000
NEXT_PUBLIC_LARAVEL_API_URL=http://localhost:8000

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Site URL
NEXT_PUBLIC_SITE_URL=https://roihin.precisiondevlab.com
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret_here
```

## Path Aliases

TypeScript path alias configured:

- `@/*` maps to `./src/*`

## Security Configuration

Content Security Policy and security headers configured in `next.config.ts`:

- CSP restricts script/style sources
- X-Frame-Options: DENY
- Strict CORS policies
- No sensitive data in code

## Performance Optimizations

1. **Font Optimization**: Mixed Language font system loaded via Next.js font optimization
   - Playfair Display for Latin/English serif characters
   - Prompt for Thai characters (supports weights 100-900)
   - Inter as fallback sans-serif
2. **Image Optimization**: Next.js Image component with remote patterns for Unsplash and Wix
3. **Code Splitting**: Automatic with App Router
4. **Turbopack**: Enabled in development for faster builds

## API Helpers

### Key Helper Functions

All helpers in `/src/lib/api/` interact with Laravel REST API:

- `getProfile()` / `updateProfile()` - User profile management
- `toggleWishlist()` / `fetchWishlist()` - Wishlist operations
- Testimonials, galleries, posts, products - Fetched through Next.js API routes that proxy to Laravel

## Styling Guidelines

- Use Tailwind CSS utility classes
- Font system: Mixed Language font with automatic unicode-range switching
- Color palette: gold (#D4AF37), green (#006039), light-gray (#F5F5F5)
- Responsive design with mobile-first approach
- Custom utilities: `.text-shadow`, `.line-clamp-{1-4}`, `.numeric-text`
- Dark mode not currently implemented

## Testing & Quality

- Run `npm run lint` before committing
- TypeScript strict mode enforced
- ESLint with Next.js configuration
- **E2E Testing**: Playwright configured in `/tests/` directory
  - Tests run against Chromium (Desktop) and Mobile Safari (iPhone 12)
  - Auto-starts dev server on port 3000 before tests
  - 60s timeout per test, 10min global timeout
  - Captures screenshots/videos on failure
  - Use `BASE_URL` env var to test against different environments

## Important Context Providers

- **AuthContext**: User authentication state and JWT management
- **CartContext**: Shopping cart state management
- **WishlistContext**: Wishlist/favorites functionality

## Important Files

- `/APPROACH.md` - **MANDATORY** architectural patterns and best practices (READ FIRST)
- `/src/config/cache.config.ts` - Cache configuration
- `/src/config/api.config.ts` - Centralized API configuration (use instead of process.env)
- `/src/lib/utils/error-handler.ts` - Error handling utilities (use instead of inline checks)
- `/src/lib/auth/get-token.ts` - Centralized auth token retrieval
- `/src/lib/types/wordpress.ts` - WordPress blog API types
- `/src/lib/types/wordpress-settings.ts` - WordPress settings & testimonials types
- `/src/lib/api/` - API helper functions directory
- `/next.config.ts` - Next.js configuration with CSP and i18n
- `/src/i18n/routing.ts` - Internationalization routing config
