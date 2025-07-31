# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15.4.4 e-commerce website for ROIHIN STONE & BRACELET, a personalized stone bracelet business. The project uses TypeScript, React 19, Tailwind CSS 4, and implements a bilingual (English/Thai) user interface.

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

# TypeScript type checking (no built-in script, use directly)
npx tsc --noEmit
```

## Project Architecture

### Directory Structure
- `/src/app/` - Next.js App Router pages and layouts
- `/src/components/` - Reusable React components
  - `/sections/` - Major page sections (Hero, About, Gallery, etc.)
  - `/ui/` - Base UI components (Typography, Container, BilingualText)
- `/src/config/` - Configuration files
  - `content.config.ts` - All website content (bilingual)
  - `site.config.ts` - Site metadata and configuration
- `/src/fonts/` - Custom font configurations
- `/src/lib/` - Utility functions

### Key Architectural Patterns

1. **Component Organization**: Components are organized by type (sections, ui) with barrel exports (`index.ts`) for clean imports.

2. **Bilingual Support**: The `BilingualText` component and content configuration support English/Thai text throughout the site.

3. **Typography System**: Custom `Typography` component with variants (h1-h6, subtitle, body, caption) for consistent text styling.

4. **Tailwind Configuration**: Extended with custom colors (gold, green), fonts (FCIconic, Playfair Display), and animations.

5. **Section-Based Layout**: Main page uses composable section components that accept content via props from centralized config.

### Important Files

- `src/config/content.config.ts` - Central content management for all text/images
- `src/components/ui/Typography.tsx` - Typography system implementation
- `src/components/Navigation.tsx` - Main navigation with scroll behavior
- `src/app/layout.tsx` - Root layout with font configurations

### Development Considerations

- The project uses Next.js App Router (not Pages Router)
- Turbopack is enabled for faster development builds
- All content is centralized in `content.config.ts` for easy updates
- Components use TypeScript for type safety
- Path alias `@/` maps to `./src/`
- Custom fonts include Inter, Noto Sans Thai, Playfair Display, and FCIconic

### Testing

No test runner is currently configured. Consider adding Jest or Vitest for unit testing and Playwright for E2E testing.

### Linting and Code Quality

- ESLint is configured with Next.js recommended rules
- TypeScript strict mode is enabled
- cspell is configured for spell checking (includes Thai words)