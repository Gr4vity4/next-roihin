import { sql } from 'drizzle-orm'
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core'

// Testimonials table
export const testimonials = sqliteTable('testimonials', {
  id: text('id').primaryKey(),
  avatar: text('avatar').notNull(),
  date: text('date').notNull(),
  message: text('message').notNull(),
  language: text('language').default('th'), // 'th' for Thai, 'en' for English
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  sortOrder: integer('sort_order').default(0),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
})

// Site meta data table (similar to WordPress wp_options)
export const siteMeta = sqliteTable('site_meta', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  metaKey: text('meta_key').notNull().unique(),
  metaValue: text('meta_value'),
  metaValueJson: text('meta_value_json'), // For storing JSON data
  language: text('language').default('th'), // For bilingual support
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
})

// Type definitions
export type Testimonial = typeof testimonials.$inferSelect
export type NewTestimonial = typeof testimonials.$inferInsert
export type SiteMeta = typeof siteMeta.$inferSelect
export type NewSiteMeta = typeof siteMeta.$inferInsert