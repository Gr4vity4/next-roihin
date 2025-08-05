# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15.4.4 e-commerce website for ROIHIN STONE & BRACELET, a personalized stone bracelet business. The project uses TypeScript, React 19, Tailwind CSS 4, and implements a bilingual (English/Thai) user interface with Turso database integration.

## Common Development Commands

```bash
# Development (with Turbopack)
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint

# TypeScript type checking
npx tsc --noEmit

# Database commands
npm run db:generate  # Generate SQL migrations from schema changes
npm run db:migrate   # Apply migrations to database
npm run db:push      # Push schema changes directly to database (dev)
npm run db:studio    # Open Drizzle Studio GUI for database management
```

## Project Architecture

### Tech Stack
- **Framework**: Next.js 15.4.4 with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS 4 with custom configuration
- **Database**: Turso (SQLite edge database) with Drizzle ORM
- **UI Components**: Custom component library with Radix UI primitives
- **Fonts**: Inter, Noto Sans Thai, Playfair Display, FCIconic

### Directory Structure
- `/src/app/` - Next.js App Router pages and layouts
  - `/about/` - About page
  - `/blog/` - Blog pages with dynamic routing
  - `/testimonial/` - Database-driven testimonials page
  - `/customer-service/` - Customer service page
  - `/personalized/` - Personalized products page
  - `/charmspacer/` - Charm and spacer products page
  - `/button-demo/` - Component demo page
- `/src/components/` - Reusable React components
  - `/sections/` - Major page sections (Hero, About, Gallery, etc.)
  - `/ui/` - Base UI components (Typography, Container, BilingualText, StarRating)
  - `TestimonialsContainer.tsx` - Server component for testimonials with suspense
- `/src/config/` - Configuration files
  - `content.config.ts` - All website content (bilingual)
  - `site.config.ts` - Site metadata and configuration
- `/src/lib/` - Utility functions and database
  - `/db/` - Database configuration and queries
    - `schema.ts` - Drizzle schema definitions (testimonials, siteMeta)
    - `config.ts` - Turso client configuration
    - `testimonials.ts` - Testimonials CRUD operations
- `/src/fonts/` - Custom font configurations
- `/drizzle/` - Generated SQL migrations

### Database Architecture

The project uses Turso (edge SQLite) with Drizzle ORM:

1. **Tables**:
   - `testimonials` - Customer reviews with bilingual support
   - `site_meta` - Key-value store for site configuration (similar to WordPress options)

2. **Environment Variables** (required in `.env.local`):
   ```
   TURSO_DATABASE_URL=libsql://your-database.turso.io
   TURSO_AUTH_TOKEN=your-auth-token
   ```

3. **Database Operations**:
   - All database queries are abstracted in `/src/lib/db/`
   - Uses Drizzle ORM for type-safe queries
   - Implements soft deletes (isActive flag)
   - Automatic timestamp management

### Key Architectural Patterns

1. **Server Components**: Database queries run directly in React Server Components for optimal performance

2. **Suspense Boundaries**: Loading states for database content using React Suspense

3. **Error Handling**: Graceful error states for database operations

4. **Bilingual Database Content**: Language field in tables for Thai/English content separation

5. **Component Organization**: 
   - Server components for data fetching
   - Client components for interactivity
   - Barrel exports (`index.ts`) for clean imports

6. **Typography System**: Custom `Typography` component with variants (h1-h6, subtitle, body, caption)

7. **Section-Based Layout**: Composable section components with centralized content configuration

### Development Considerations

- Always run `npm run db:push` after schema changes during development
- Use `npm run db:generate` and `npm run db:migrate` for production migrations
- Database queries should handle errors gracefully with try-catch blocks
- Use TypeScript types generated from Drizzle schema (`Testimonial`, `NewTestimonial`, etc.)
- Server Components are preferred for database operations (no client-side fetching)
- Environment variables must be set for database connection
- Turbopack is enabled for faster development builds

### Image Handling

The project is configured to handle remote images from:
- `images.unsplash.com` - Stock photography
- `static.wixstatic.com` - Legacy content from previous website

### Key Configuration Files

- `drizzle.config.ts` - Database configuration for Drizzle Kit
- `tailwind.config.ts` - Custom theme with brand colors (gold, green) and fonts
- `next.config.ts` - Next.js configuration with image domains
- `eslint.config.mjs` - ESLint configuration extending Next.js standards
- `postcss.config.mjs` - PostCSS configuration for Tailwind CSS 4

### Path Aliases

The project uses TypeScript path aliases:
- `@/*` maps to `./src/*` for clean imports

### No Test Framework

Currently, no test framework is configured. Testing would need to be set up if required.