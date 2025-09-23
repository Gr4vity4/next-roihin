# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ROIHIN STONE & BRACELET - A Next.js 15 e-commerce application for personalized stone bracelets with multi-language support (Thai/English) and WordPress CMS integration.

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
```

## Architecture

### Tech Stack
- **Framework**: Next.js 15.4 with App Router
- **Language**: TypeScript with strict mode
- **Internationalization**: next-intl for Thai/English support
- **CMS**: WordPress REST API for all content management
- **Styling**: Tailwind CSS v4 with custom Mixed Language font system
- **UI Components**: Radix UI primitives, Heroicons, Lucide icons
- **Data Validation**: Zod schemas for API responses

### Project Structure
- `/src/app/[locale]/` - Internationalized Next.js App Router pages
- `/src/app/api/` - API proxy routes for WordPress integration
- `/src/components/` - Reusable React components
- `/src/components/sections/` - Page-specific section components
- `/src/components/ui/` - UI primitives and utilities
- `/src/lib/api/` - API helper functions for WordPress integration
- `/src/lib/types/` - TypeScript type definitions
- `/src/config/` - Configuration files (cache, content, site)
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

#### 2. WordPress CMS Integration
All content managed through WordPress REST API at `https://wp-roihin.precisiondevlab.com`:
- Posts API: `/api/blog/posts`
- Categories API: `/api/blog/categories`
- Individual post: `/api/blog/posts/[title]`
- Site Settings API: `/api/site-settings`
- Testimonials API: `/api/testimonials`
- Gallery API: `/api/gallery`

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
# WordPress API Configuration
WORDPRESS_API_URL=https://wp-roihin.precisiondevlab.com
WORDPRESS_API_BASE_PATH=/wp-json/wp/v2
NEXT_PUBLIC_WORDPRESS_API_URL=https://wp-roihin.precisiondevlab.com

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Site URL
NEXT_PUBLIC_SITE_URL=https://roihin.precisiondevlab.com
NEXT_PUBLIC_BASE_URL=http://localhost:3000
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

1. **Font Optimization**: Mixed Language font system with unicode-range splitting
   - Bodoni Moda for Latin/English characters
   - Sukhumvit Set for Thai characters
   - Inter as fallback
2. **Image Optimization**: Next.js Image component with remote patterns for Unsplash, Wix, and WordPress
3. **Code Splitting**: Automatic with App Router
4. **Turbopack**: Enabled in development for faster builds

## API Helpers

### Key Helper Functions
- `getTestimonials(language)` - Fetch testimonials from WordPress
- `getSiteSettings()` - Get site settings from WordPress
- `getGalleryPhotos(language)` - Fetch gallery photos from WordPress
- `siteMetaHelpers.getContactInfo()` - Get contact information
- `siteMetaHelpers.getSocialLinks()` - Get social media links

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
- No dedicated test framework currently configured

## Important Context Providers

- **AuthContext**: User authentication state and JWT management
- **CartContext**: Shopping cart state management
- **WishlistContext**: Wishlist/favorites functionality

## Important Files

- `/src/config/cache.config.ts` - Cache configuration
- `/src/lib/types/wordpress.ts` - WordPress blog API types
- `/src/lib/types/wordpress-settings.ts` - WordPress settings & testimonials types
- `/src/lib/api/` - API helper functions directory
- `/next.config.ts` - Next.js configuration with CSP and i18n
- `/src/i18n/routing.ts` - Internationalization routing config