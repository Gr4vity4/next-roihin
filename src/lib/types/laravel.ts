import { z } from 'zod'

/**
 * Laravel API Response Metadata Schema
 */
export const LaravelMetaSchema = z.object({
  locale: z.string(),
  pagination: z.object({
    total: z.number(),
    per_page: z.number(),
    current_page: z.number(),
    last_page: z.number(),
  }).optional(),
  total: z.number().optional(),
  category: z.object({
    id: z.number(),
    slug: z.string(),
    name: z.string(),
  }).optional(),
})

export type LaravelMeta = z.infer<typeof LaravelMetaSchema>

/**
 * Laravel API Category Schema
 */
export const LaravelCategorySchema = z.object({
  id: z.number(),
  slug: z.string(),
  name: z.string(),
  posts_count: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
})

export type LaravelCategory = z.infer<typeof LaravelCategorySchema>

/**
 * Laravel API Post Schema
 */
export const LaravelPostSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.string(),
  excerpt: z.string(),
  content: z.string(),
  featured_image: z.string().nullable(),
  category: LaravelCategorySchema.nullable().optional(),
  published_at: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
})

export type LaravelPost = z.infer<typeof LaravelPostSchema>

/**
 * Laravel API Testimonial Schema
 */
export const LaravelTestimonialSchema = z.object({
  id: z.number(),
  message: z.string(),
  avatar: z.string().nullable(),
  date: z.string(),
  is_active: z.boolean(),
  sort_order: z.number(),
  review_image: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
})

export type LaravelTestimonial = z.infer<typeof LaravelTestimonialSchema>

/**
 * Laravel API Gallery Image Schema
 */
export const LaravelGalleryImageSchema = z.object({
  id: z.number(),
  image_path: z.string(),
  image_url: z.string(),
  sort_order: z.number(),
})

export type LaravelGalleryImage = z.infer<typeof LaravelGalleryImageSchema>

/**
 * Laravel API Gallery Schema
 */
export const LaravelGallerySchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  images: z.array(LaravelGalleryImageSchema),
  created_at: z.string(),
  updated_at: z.string(),
})

export type LaravelGallery = z.infer<typeof LaravelGallerySchema>

/**
 * Laravel API Posts Response Schema
 */
export const LaravelPostsResponseSchema = z.object({
  data: z.array(LaravelPostSchema),
  meta: LaravelMetaSchema,
})

export type LaravelPostsResponse = z.infer<typeof LaravelPostsResponseSchema>

/**
 * Laravel API Single Post Response Schema
 */
export const LaravelSinglePostResponseSchema = z.object({
  data: LaravelPostSchema,
  meta: LaravelMetaSchema,
})

export type LaravelSinglePostResponse = z.infer<typeof LaravelSinglePostResponseSchema>

/**
 * Laravel API Categories Response Schema
 */
export const LaravelCategoriesResponseSchema = z.object({
  data: z.array(LaravelCategorySchema),
  meta: LaravelMetaSchema,
})

export type LaravelCategoriesResponse = z.infer<typeof LaravelCategoriesResponseSchema>

/**
 * Laravel API Testimonials Response Schema
 */
export const LaravelTestimonialsResponseSchema = z.object({
  data: z.array(LaravelTestimonialSchema),
  meta: LaravelMetaSchema,
})

export type LaravelTestimonialsResponse = z.infer<typeof LaravelTestimonialsResponseSchema>

/**
 * Laravel API Galleries Response Schema
 */
export const LaravelGalleriesResponseSchema = z.object({
  data: z.array(LaravelGallerySchema),
  meta: LaravelMetaSchema,
})

export type LaravelGalleriesResponse = z.infer<typeof LaravelGalleriesResponseSchema>

/**
 * Laravel API Single Gallery Response Schema
 */
export const LaravelSingleGalleryResponseSchema = z.object({
  data: LaravelGallerySchema,
  meta: LaravelMetaSchema,
})

export type LaravelSingleGalleryResponse = z.infer<typeof LaravelSingleGalleryResponseSchema>
