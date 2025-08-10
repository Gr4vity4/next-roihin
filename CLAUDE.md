# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ROIHIN STONE & BRACELET - A Next.js 15 e-commerce application for personalized stone bracelets with bilingual support (Thai/English) and WordPress CMS integration.

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
- **CMS**: WordPress REST API for all content management
- **Styling**: Tailwind CSS v4 with custom FC Iconic font
- **CMS**: WordPress REST API integration for blog content
- **UI Components**: Radix UI primitives, Heroicons, Lucide icons

### Project Structure
- `/src/app/` - Next.js App Router pages and API routes
- `/src/components/` - Reusable React components
- `/src/components/sections/` - Page-specific section components
- `/src/components/ui/` - UI primitives and utilities
- `/src/lib/api/` - API helper functions for WordPress integration
- `/src/config/` - Configuration files (cache, content, site)
- `/public/images/` - Static images organized by feature

### Key Architectural Patterns

#### 1. Caching Strategy
The app uses environment-aware caching configured in `/src/config/cache.config.ts`:
- **Development**: All caching disabled for better DX
- **Production**: Strategic caching with 5-minute revalidation for dynamic content

#### 2. WordPress CMS Integration
All content managed through WordPress REST API:
- Testimonials fetched from WordPress custom post type
- Site settings from WordPress ACF fields
- Blog posts and categories from WordPress

#### 3. API Proxy Endpoints
Content fetched from WordPress REST API at `https://wp-roihin.precisiondevlab.com`:
- Posts API: `/api/blog/posts`
- Categories API: `/api/blog/categories`
- Individual post: `/api/blog/posts/[title]`
- Site Settings API: `/api/site-settings`
- Testimonials API: `/api/testimonials`

#### 4. Component Organization
- Page components use server components by default
- Loading states implemented with loading.tsx files
- Error boundaries for graceful error handling
- Suspense boundaries for optimal streaming

## Environment Variables

Required in `.env.local`:
```env
WORDPRESS_API_URL=https://wp-roihin.precisiondevlab.com
WORDPRESS_API_BASE_PATH=/wp-json/wp/v2
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

1. **Font Optimization**: Custom FC Iconic font with subset loading
2. **Image Optimization**: Next.js Image component with remote patterns
3. **Code Splitting**: Automatic with App Router
4. **Turbopack**: Enabled in development for faster builds

## API Helpers

### Helper Functions
- `getTestimonials(language)` - Fetch testimonials from WordPress
- `getSiteSettings()` - Get site settings from WordPress
- `siteMetaHelpers.getContactInfo()` - Get contact information
- `siteMetaHelpers.getSocialLinks()` - Get social media links

## API Routes Pattern

All API routes follow consistent patterns:
1. Use `getFetchConfig()` for cache configuration
2. Return `getCacheHeaders()` in responses
3. Validate with Zod schemas
4. Handle errors gracefully with fallbacks

## Styling Guidelines

- Use Tailwind CSS utility classes
- Custom fonts: FC Iconic (Thai), Playfair Display (headings), Inter (body)
- Responsive design with mobile-first approach
- Dark mode not currently implemented

## Testing & Quality

- Run `npm run lint` before committing
- TypeScript strict mode enforced
- ESLint with Next.js configuration
- No dedicated test framework currently configured

## Important Files

- `/src/config/cache.config.ts` - Cache configuration
- `/src/lib/types/wordpress.ts` - WordPress blog API types
- `/src/lib/types/wordpress-settings.ts` - WordPress settings & testimonials types
- `/src/lib/api/` - API helper functions
- `/next.config.ts` - Next.js configuration with CSP