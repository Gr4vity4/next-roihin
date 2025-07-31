# Database Integration Guide

This project uses Turso (LibSQL) as the database with Drizzle ORM for type-safe database operations.

## Database Setup

### Environment Variables

Add these to your `.env.local` file:

```env
TURSO_DATABASE_URL=your-turso-database-url
TURSO_AUTH_TOKEN=your-turso-auth-token
```

### Dependencies

The following packages are installed:

- `@libsql/client` - Turso client library
- `drizzle-orm` - Type-safe ORM
- `drizzle-kit` - Database toolkit

## Database Schema

### Tables

#### 1. `testimonials`
Stores customer testimonials/reviews.

```sql
CREATE TABLE testimonials (
  id TEXT PRIMARY KEY,
  avatar TEXT NOT NULL,
  date TEXT NOT NULL,
  message TEXT NOT NULL,
  language TEXT DEFAULT 'th',
  is_active INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. `site_meta`
Stores website meta data (similar to WordPress wp_options).

```sql
CREATE TABLE site_meta (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  meta_key TEXT NOT NULL UNIQUE,
  meta_value TEXT,
  meta_value_json TEXT,
  language TEXT DEFAULT 'th',
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

## Database Scripts

### Available Commands

```bash
# Generate migrations
npm run db:generate

# Apply migrations
npm run db:migrate

# Push schema changes directly
npm run db:push

# Open Drizzle Studio
npm run db:studio
```

### Setup and Seeding

```bash
# Create tables
npx tsx src/lib/db/migrate.ts

# Seed with sample data
npx tsx src/lib/db/seed.ts
```

### Admin Commands

```bash
# List all testimonials
npx tsx src/lib/db/admin.ts list-testimonials

# List all site meta
npx tsx src/lib/db/admin.ts list-meta

# Toggle testimonial visibility
npx tsx src/lib/db/admin.ts toggle-testimonial 1 false

# Update site meta
npx tsx src/lib/db/admin.ts update-meta contact_phone "+66-123-456-789"
```

## Usage in Code

### Testimonials

```typescript
import { getTestimonials, createTestimonial, updateTestimonial } from '@/lib/db/testimonials'

// Get all active testimonials
const testimonials = await getTestimonials('th')

// Get testimonials by language
const englishTestimonials = await getTestimonials('en')

// Create new testimonial
const newTestimonial = await createTestimonial({
  id: 'unique-id',
  avatar: '/images/avatar.jpg',
  date: '2024-01-01',
  message: 'Great service!',
  language: 'en'
})
```

### Site Meta Data

```typescript
import { siteMetaHelpers, getSiteMetaValue, setSiteMetaJson } from '@/lib/db/site-meta'

// Get contact information
const contactInfo = await siteMetaHelpers.getContactInfo('th')

// Update social links
await siteMetaHelpers.setSocialLinks({
  facebook: 'https://facebook.com/roihin',
  instagram: '@roihin'
}, 'th')

// Set custom meta value
await setSiteMetaJson('custom_settings', {
  theme: 'dark',
  notifications: true
}, 'th')
```

### Server Components

```typescript
// app/testimonials/page.tsx
import { getTestimonials } from '@/lib/db/testimonials'

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials('th')
  
  return (
    <div>
      {testimonials.map(testimonial => (
        <div key={testimonial.id}>
          <p>{testimonial.message}</p>
        </div>
      ))}
    </div>
  )
}
```

## Data Management

### Bilingual Support

The database supports bilingual content through the `language` field:

- `'th'` - Thai content
- `'en'` - English content

### Site Meta Helpers

Pre-built helpers for common site data:

```typescript
// Contact information
await siteMetaHelpers.getContactInfo('th')
await siteMetaHelpers.setContactInfo({
  address: 'Bangkok, Thailand',
  phone: '+66-xxx-xxx-xxxx',
  email: 'info@roihin.com',
  hours: 'Mon-Sat 9:00-18:00'
}, 'th')

// Social links
await siteMetaHelpers.getSocialLinks('th')
await siteMetaHelpers.setSocialLinks({
  facebook: 'https://facebook.com/roihin',
  instagram: 'https://instagram.com/roihin',
  line: '@roihin'
}, 'th')

// About us content
await siteMetaHelpers.getAboutUs('th')
await siteMetaHelpers.setAboutUs('Company description...', 'th')
```

## File Structure

```
src/lib/db/
├── config.ts           # Database connection config
├── index.ts           # Main exports
├── schema.ts          # Database schema definitions
├── testimonials.ts    # Testimonial operations
├── site-meta.ts       # Site meta operations
├── migrate.ts         # Migration script
├── seed.ts           # Seeding script
├── admin.ts          # Admin utility commands
└── example-usage.ts  # Usage examples
```

## Error Handling

All database functions include proper error handling:

- Functions throw errors that should be caught by calling code
- Server components handle errors gracefully with fallback UI
- Loading states are provided through React Suspense

## Type Safety

Full TypeScript support with inferred types:

```typescript
import type { Testimonial, NewTestimonial, SiteMeta } from '@/lib/db'

// Type-safe operations
const testimonial: Testimonial = await getTestimonialById('1')
const newTestimonial: NewTestimonial = {
  id: '2',
  avatar: '/avatar.jpg',
  date: '2024-01-01',
  message: 'Great!'
}
```

## Migration from Static Data

The existing testimonial data has been migrated to the database:
- All static testimonial data moved to `testimonials` table
- Language detection applied automatically
- Bilingual support maintained
- Loading and error states implemented

## Production Considerations

1. **Environment Variables**: Ensure production environment has correct Turso credentials
2. **Error Monitoring**: Add error monitoring for database operations
3. **Caching**: Consider adding caching layer for frequently accessed data
4. **Backup**: Set up regular database backups through Turso dashboard
5. **Performance**: Monitor query performance and optimize as needed