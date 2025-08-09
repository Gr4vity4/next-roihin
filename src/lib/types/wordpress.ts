import { z } from 'zod'

/**
 * WordPress API Category Schema
 */
export const WordPressCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  parent: z.number().optional(),
  count: z.number().optional(),
})

export type WordPressCategory = z.infer<typeof WordPressCategorySchema>

/**
 * WordPress API Featured Media Schema
 */
export const WordPressFeaturedMediaSchema = z.object({
  id: z.number().optional(),
  source_url: z.string().optional(),
  alt_text: z.string().optional(),
})

/**
 * WordPress API Post Content Schema
 */
export const WordPressContentSchema = z.object({
  rendered: z.string(),
  protected: z.boolean().optional(),
})

/**
 * WordPress API Post Title Schema
 */
export const WordPressTitleSchema = z.object({
  rendered: z.string(),
})

/**
 * WordPress API ACF Fields Schema
 */
export const WordPressACFSchema = z.object({
  hero_image: z.string().optional(),
}).optional()

/**
 * WordPress API Author Schema
 */
export const WordPressAuthorSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  avatar_urls: z.object({}).passthrough().optional(),
})

/**
 * WordPress API Term Schema
 */
export const WordPressTermSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  taxonomy: z.string(),
})

/**
 * WordPress API Post Schema (for lists)
 */
export const WordPressPostSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: WordPressTitleSchema,
  content: WordPressContentSchema,
  excerpt: WordPressContentSchema,
  date: z.string(),
  categories: z.array(z.number()),
  _links: z.object({}).passthrough().optional(),
  _embedded: z.object({
    'wp:featuredmedia': z.array(WordPressFeaturedMediaSchema).optional(),
  }).optional(),
})

/**
 * WordPress API Single Post Schema (with ACF and full embedded data)
 */
export const WordPressSinglePostSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: WordPressTitleSchema,
  content: WordPressContentSchema,
  excerpt: WordPressContentSchema,
  date: z.string(),
  categories: z.array(z.number()),
  acf: WordPressACFSchema,
  _links: z.object({}).passthrough().optional(),
  _embedded: z.object({
    author: z.array(WordPressAuthorSchema).optional(),
    'wp:featuredmedia': z.array(WordPressFeaturedMediaSchema).optional(),
    'wp:term': z.array(z.array(WordPressTermSchema)).optional(),
  }).optional(),
})

export type WordPressPost = z.infer<typeof WordPressPostSchema>
export type WordPressSinglePost = z.infer<typeof WordPressSinglePostSchema>

/**
 * WordPress API Categories Response Schema
 */
export const WordPressCategoriesResponseSchema = z.array(WordPressCategorySchema)

/**
 * WordPress API Posts Response Schema
 */
export const WordPressPostsResponseSchema = z.array(WordPressPostSchema)

/**
 * Processed Blog Category for Frontend
 */
export interface BlogCategory {
  id: string
  name: {
    english: string
    thai: string
  }
}

/**
 * Processed Blog Post for Frontend (list view)
 */
export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  image: string
  date: string
  categories: number[]
}

/**
 * Processed Single Blog Post for Frontend (detail view)
 */
export interface BlogPostDetails {
  id: string
  slug: string
  title: string
  content: string
  excerpt: string
  heroImage: string
  featuredImage?: string
  date: string
  categories: number[]
  author?: {
    id: number
    name: string
    description?: string
  }
  terms?: Array<{
    id: number
    name: string
    slug: string
    taxonomy: string
  }>
}

/**
 * Blog API Response Types
 */
export interface BlogCategoriesResponse {
  categories: BlogCategory[]
}

export interface BlogPostsResponse {
  posts: BlogPost[]
  totalPages?: number
  currentPage?: number
}

export interface BlogPostDetailsResponse {
  post: BlogPostDetails
}

/**
 * API Error Response Schema
 */
export const ApiErrorSchema = z.object({
  error: z.string(),
  message: z.string().optional(),
  status: z.number().optional(),
})

export type ApiError = z.infer<typeof ApiErrorSchema>