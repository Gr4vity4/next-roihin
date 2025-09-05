import { z } from 'zod'

// Bank Types
export const BankSchema = z.object({
  acf: z.object({
    bank_image: z.string(),
    bank_name: z.string(),
    bank_branch_name: z.string(),
    bank_account_name: z.string(),
    bank_account_number: z.string(),
  }),
})

export type Bank = z.infer<typeof BankSchema>

// Product Types
export const ColorOptionSchema = z.object({
  color: z.string(),
  color_icon_optional: z.string().nullable().optional(),
  price: z.string(),
  available: z.boolean(),
})

export const ProductGalleryImageSchema = z.object({
  ID: z.number(),
  id: z.number(),
  title: z.string(),
  filename: z.string(),
  filesize: z.number(),
  url: z.string(),
  link: z.string(),
  alt: z.string(),
  author: z.string(),
  description: z.string(),
  caption: z.string(),
  name: z.string(),
  status: z.string(),
  uploaded_to: z.number(),
  date: z.string(),
  modified: z.string(),
  menu_order: z.number(),
  mime_type: z.string(),
  type: z.string(),
  subtype: z.string(),
  icon: z.string(),
  width: z.number(),
  height: z.number(),
  sizes: z.record(z.string(), z.union([z.string(), z.number()])),
})

export const ProductSchema = z.object({
  acf: z.object({
    product_category: z.string(),
    material: z.string(),
    size_dimensions: z.string(),
    color_options: z.array(ColorOptionSchema),
    product_image: z.string(),
    product_gallery: z.array(ProductGalleryImageSchema),
    description: z.string(),
  }),
})

export type Product = z.infer<typeof ProductSchema>
export type ColorOption = z.infer<typeof ColorOptionSchema>
export type ProductGalleryImage = z.infer<typeof ProductGalleryImageSchema>

// Stone Types
export const StoneStorySchema = z.object({
  energy_element: z.string(),
  connected_chakras: z.string(),
  ascendant: z.string(),
  star_relations: z.string(),
})

export const StoneSizeSchema = z.object({
  size_6_mm_base_price: z.string(),
  size_8_mm_base_price: z.string(),
  size_10_mm_base_price: z.string(),
  size_12_mm_base_price: z.string(),
})

export const StoneSchema = z.object({
  acf: z.object({
    stone_image: z.string(),
    title: z.string(),
    sub_title: z.string(),
    description: z.string(),
    story: StoneStorySchema,
    category: z.string(),
    size: StoneSizeSchema,
  }),
})

export type Stone = z.infer<typeof StoneSchema>
export type StoneStory = z.infer<typeof StoneStorySchema>
export type StoneSize = z.infer<typeof StoneSizeSchema>

// Page Setting Types
export const PageSettingSchema = z.object({
  acf: z.object({
    address: z.string(),
    phone: z.string(),
    email: z.string(),
    google_map: z.string(),
    facebook: z.string(),
    instagram: z.string(),
    tiktok: z.string(),
    pinterest: z.string(),
    line: z.string(),
  }),
})

export type PageSetting = z.infer<typeof PageSettingSchema>

// API Response Types
export const BanksResponseSchema = z.array(BankSchema)
export const ProductsResponseSchema = z.array(ProductSchema)
export const StonesResponseSchema = z.array(StoneSchema)
export const PageSettingsResponseSchema = z.array(PageSettingSchema)

export type BanksResponse = z.infer<typeof BanksResponseSchema>
export type ProductsResponse = z.infer<typeof ProductsResponseSchema>
export type StonesResponse = z.infer<typeof StonesResponseSchema>
export type PageSettingsResponse = z.infer<typeof PageSettingsResponseSchema>