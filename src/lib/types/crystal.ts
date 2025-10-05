/**
 * Crystal Type Definitions
 *
 * Types for WordPress Crystal Manager plugin ACF fields and frontend data models
 */

// ============================================================================
// WordPress ACF Response Types
// ============================================================================

/**
 * ACF Image Field Type
 */
export interface ACFImage {
  id: number
  url: string
  alt: string
  title?: string
  width?: number
  height?: number
  sizes?: {
    thumbnail?: string
    medium?: string
    large?: string
    [key: string]: string | undefined
  }
}

/**
 * ACF Gallery Image Type
 */
export interface ACFGalleryImage {
  id: number
  url: string
  alt: string
}

/**
 * Description Paragraph Repeater Field
 */
export interface DescriptionParagraph {
  paragraph_text: string
}

/**
 * Complete ACF Fields for Crystal Post Type
 */
export interface CrystalACF {
  // Basic Information
  crystal_name_en: string
  crystal_name_th: string
  crystal_slug: string
  crystal_main_image: ACFImage
  crystal_gallery_images?: ACFGalleryImage[]

  // Properties
  energy_element: string          // e.g., "au, น้ำ"
  chakra: string[]                // Multiple chakra points
  zodiac_compatibility: string[]  // Zodiac signs
  ruling_planet: string           // Associated planet
  crystal_colors: string[]        // Crystal colors

  // Content
  description_paragraphs: DescriptionParagraph[]
  crystal_attributes: string

  // Filter Fields
  energy_properties: string[]     // finance_fortune, work_business, etc.
  zodiac_signs: string[]          // aries, taurus, gemini, etc.
  element_type: string[]          // earth, water, air, fire
  color_filter: string[]          // purple, blue, teal, etc.

  // Related Products (optional)
  related_products?: number[]     // Array of product/crystal IDs
}

/**
 * WordPress Crystal Post Type Response
 */
export interface CrystalPostType {
  id: number
  slug: string
  title: {
    rendered: string
  }
  acf: CrystalACF
  _links?: {
    [key: string]: unknown
  }
}

// ============================================================================
// Frontend Data Models
// ============================================================================

/**
 * Basic Crystal for Grid Display
 * Used in crystal catalog listing page
 */
export interface Crystal {
  id: string
  slug: string
  nameEn: string
  nameTh: string
  image: string
}

/**
 * Full Crystal Product for Detail Page
 * Contains all properties and content for product detail view
 */
export interface CrystalProduct {
  id: string
  slug: string
  nameEn: string
  nameTh: string
  image: string
  galleryImages?: string[]

  properties: {
    priceComplete: string          // energy_element in Thai
    chakra: string[]              // chakra field
    zodiacCompatibility: string[] // zodiac_compatibility
    rulingPlanet: string          // ruling_planet
    color: string[]               // crystal_colors
  }

  description: string[]           // description_paragraphs mapped
  attributes: string              // crystal_attributes

  // Filter fields for displaying tags/badges
  filters: {
    energyProperties: string[]    // energy_properties
    zodiacSigns: string[]         // zodiac_signs
    elements: string[]            // element_type
    colors: string[]              // color_filter
  }
}

/**
 * Related Crystal Product
 * Used in "Related Products" section
 */
export interface RelatedCrystalProduct {
  id: string
  slug: string
  nameEn: string
  nameTh: string
  image: string
  price: number
  originalPrice: number
}

// ============================================================================
// API Request/Response Types
// ============================================================================

/**
 * Filter parameters for crystal catalog API
 */
export interface CrystalFilterParams {
  lang?: 'en' | 'th'
  page?: number
  per_page?: number
  search?: string
  color_filter?: string      // Comma-separated color values
  energy_properties?: string // Comma-separated energy values
  zodiac_signs?: string      // Comma-separated zodiac values
  element_type?: string      // Comma-separated element values
}

/**
 * API Response for crystal listing
 */
export interface CrystalsAPIResponse {
  crystals: Crystal[]
  totalPages: number
  currentPage: number
  totalItems?: number
}

/**
 * API Response for single crystal
 */
export interface CrystalAPIResponse {
  crystal: CrystalProduct | null
  error?: string
}

// ============================================================================
// Filter Value Mappings
// ============================================================================

/**
 * Color filter values matching ACF field choices
 */
export const COLOR_FILTER_VALUES = [
  'purple',
  'blue',
  'teal',
  'green',
  'yellow',
  'orange',
  'red',
  'light-blue',
  'pink',
  'black',
  'white',
  'beige',
] as const

export type ColorFilterValue = typeof COLOR_FILTER_VALUES[number]

/**
 * Energy property filter values matching ACF field choices
 */
export const ENERGY_PROPERTY_VALUES = [
  'finance_fortune',
  'work_business',
  'love_happiness',
  'health_balance',
  'spirituality_stability',
] as const

export type EnergyPropertyValue = typeof ENERGY_PROPERTY_VALUES[number]

/**
 * Zodiac sign filter values matching ACF field choices
 */
export const ZODIAC_SIGN_VALUES = [
  'aries',
  'taurus',
  'gemini',
  'cancer',
  'leo',
  'virgo',
  'libra',
  'scorpio',
  'sagittarius',
  'capricorn',
  'aquarius',
  'pisces',
] as const

export type ZodiacSignValue = typeof ZODIAC_SIGN_VALUES[number]

/**
 * Element type filter values matching ACF field choices
 */
export const ELEMENT_TYPE_VALUES = [
  'earth',
  'water',
  'air',
  'fire',
] as const

export type ElementTypeValue = typeof ELEMENT_TYPE_VALUES[number]

// ============================================================================
// Data Transformation Utilities
// ============================================================================

/**
 * Transform WordPress Crystal Post to frontend Crystal model
 */
export function transformToCrystal(post: CrystalPostType): Crystal {
  return {
    id: post.id.toString(),
    slug: post.acf.crystal_slug || post.slug,
    nameEn: post.acf.crystal_name_en,
    nameTh: post.acf.crystal_name_th,
    image: post.acf.crystal_main_image?.url || '',
  }
}

/**
 * Transform WordPress Crystal Post to frontend CrystalProduct model
 */
export function transformToCrystalProduct(post: CrystalPostType): CrystalProduct {
  const acf = post.acf

  // Safely handle gallery images - ensure it's an array
  const galleryImages = Array.isArray(acf.crystal_gallery_images)
    ? acf.crystal_gallery_images.map(img => img.url)
    : []

  // Safely handle description paragraphs - ensure it's an array
  const description = Array.isArray(acf.description_paragraphs)
    ? acf.description_paragraphs.map(p => p.paragraph_text)
    : []

  return {
    id: post.id.toString(),
    slug: acf.crystal_slug || post.slug,
    nameEn: acf.crystal_name_en,
    nameTh: acf.crystal_name_th,
    image: acf.crystal_main_image?.url || '',
    galleryImages,

    properties: {
      priceComplete: acf.energy_element || '',
      chakra: Array.isArray(acf.chakra) ? acf.chakra : [],
      zodiacCompatibility: Array.isArray(acf.zodiac_compatibility) ? acf.zodiac_compatibility : [],
      rulingPlanet: acf.ruling_planet || '',
      color: Array.isArray(acf.crystal_colors) ? acf.crystal_colors : [],
    },

    description,
    attributes: acf.crystal_attributes || '',

    filters: {
      energyProperties: Array.isArray(acf.energy_properties) ? acf.energy_properties : [],
      zodiacSigns: Array.isArray(acf.zodiac_signs) ? acf.zodiac_signs : [],
      elements: Array.isArray(acf.element_type) ? acf.element_type : [],
      colors: Array.isArray(acf.color_filter) ? acf.color_filter : [],
    },
  }
}
