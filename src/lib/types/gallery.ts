import { z } from 'zod'

/**
 * WordPress Photo Gallery ACF Schema
 */
export const PhotoGalleryACFSchema = z.object({
  uid: z.string(),
  gallery: z.array(z.string()),
})

/**
 * WordPress Photo Gallery Response Schema
 */
export const PhotoGalleryItemSchema = z.object({
  acf: PhotoGalleryACFSchema,
})

/**
 * WordPress Photo Gallery Response Array Schema
 */
export const PhotoGalleryResponseSchema = z.array(PhotoGalleryItemSchema)

/**
 * TypeScript types inferred from Zod schemas
 */
export type PhotoGalleryACF = z.infer<typeof PhotoGalleryACFSchema>
export type PhotoGalleryItem = z.infer<typeof PhotoGalleryItemSchema>
export type PhotoGalleryResponse = z.infer<typeof PhotoGalleryResponseSchema>