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
 * WordPress Testimonial ACF Schema
 */
export const WordPressTestimonialACFSchema = z.object({
  avatar: z.string().url(),
  message: z.string(),
  date: z.string(),
  is_active: z.boolean(),
  sort_order: z.coerce.number(), // Convert string to number
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