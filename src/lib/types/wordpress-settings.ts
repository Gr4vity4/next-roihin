import { z } from 'zod'

/**
 * WordPress Page Settings ACF Contact Schema
 */
export const WordPressContactSchema = z.object({
  address: z.string(),
  phone: z.string(),
  email: z.string(),
  hours: z.string(),
})

/**
 * WordPress Page Settings ACF Social Network Schema
 */
export const WordPressSocialNetworkSchema = z.object({
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  youtube: z.string().optional(),
  tiktok: z.string().optional(),
  pinterest: z.string().optional(),
  line: z.string().optional(),
})

/**
 * WordPress Page Settings ACF Schema
 */
export const WordPressPageSettingsACFSchema = z.object({
  contact: WordPressContactSchema,
  social_network: WordPressSocialNetworkSchema,
})

/**
 * WordPress Page Settings Schema
 */
export const WordPressPageSettingsSchema = z.object({
  acf: WordPressPageSettingsACFSchema,
})

/**
 * WordPress Page Settings Response Schema
 */
export const WordPressPageSettingsResponseSchema = z.array(WordPressPageSettingsSchema)

/**
 * WordPress Image Schema for ACF fields
 * Made fields optional to match actual WordPress API response structure
 */
export const WordPressImageSchema = z
  .object({
    ID: z.number().optional(),
    id: z.number().optional(),
    title: z.string().optional(),
    filename: z.string().optional(),
    filesize: z.number().optional(),
    url: z.string(),
    link: z.string().optional(),
    alt: z.string().optional(),
    author: z.string().optional(),
    description: z.string().optional(),
    caption: z.string().optional(),
    name: z.string().optional(),
    status: z.string().optional(),
    uploaded_to: z.number().optional(),
    date: z.string().optional(),
    modified: z.string().optional(),
    menu_order: z.number().optional(),
    mime_type: z.string().optional(),
    type: z.string().optional(),
    subtype: z.string().optional(),
    icon: z.string().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    sizes: z.record(z.string(), z.any()).optional(),
  })
  .nullable()

/**
 * WordPress Testimonial ACF Schema
 */
export const WordPressTestimonialACFSchema = z.object({
  avatar: z.string(),
  message: z.string(),
  date: z.string(),
  is_active: z.boolean(),
  sort_order: z.coerce.number(), // Convert string to number
  review_image: WordPressImageSchema.optional(),
})

/**
 * WordPress Testimonial Schema
 */
export const WordPressTestimonialSchema = z.object({
  acf: WordPressTestimonialACFSchema,
})

/**
 * WordPress Testimonials Response Schema
 */
export const WordPressTestimonialsResponseSchema = z.array(WordPressTestimonialSchema)

// Type exports
export type WordPressContact = z.infer<typeof WordPressContactSchema>
export type WordPressSocialNetwork = z.infer<typeof WordPressSocialNetworkSchema>
export type WordPressPageSettingsACF = z.infer<typeof WordPressPageSettingsACFSchema>
export type WordPressPageSettings = z.infer<typeof WordPressPageSettingsSchema>
export type WordPressTestimonialACF = z.infer<typeof WordPressTestimonialACFSchema>
export type WordPressTestimonial = z.infer<typeof WordPressTestimonialSchema>

/**
 * Processed Site Settings for Frontend
 */
export interface SiteSettings {
  contact: {
    address: string
    phone: string
    email: string
    hours: string
  }
  socialLinks: {
    facebook?: string
    instagram?: string
    youtube?: string
    tiktok?: string
    pinterest?: string
    line?: string
  }
}

/**
 * Processed Testimonial for Frontend
 */
export interface Testimonial {
  id: string
  avatar: string
  message: string
  date: string
  isActive: boolean
  sortOrder: number
  reviewImage?: string | null
}

/**
 * API Response Types
 */
export interface SiteSettingsResponse {
  settings: SiteSettings
}

export interface TestimonialsResponse {
  testimonials: Testimonial[]
}