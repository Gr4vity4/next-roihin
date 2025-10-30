/**
 * Crystal model types derived from the Laravel Stones API.
 * These shapes are consumed across list and detail views.
 */

export type CrystalLocale = 'en' | 'th'

export interface CrystalStory {
  energyElement: string
  connectedChakras: string[]
  ascendant: string[]
  starRelations: string[]
}

export interface CrystalSizePricing {
  size6mm?: string
  size8mm?: string
  size10mm?: string
  size12mm?: string
}

export interface Crystal {
  id: string
  slug: string
  title: string
  subtitle?: string
  image: string
  previewImage?: string
  category?: string
  color?: string
  toneColors?: string[]
  locale: CrystalLocale
  story?: CrystalStory
  sizePrices?: CrystalSizePricing
}

export interface CrystalProduct extends Crystal {
  story: CrystalStory
  sizePrices: CrystalSizePricing
  description: string[]
}

export interface CrystalFilterParams {
  lang?: CrystalLocale
  page?: number
  per_page?: number
  search?: string
  color_filter?: string
  energy_properties?: string
  zodiac_signs?: string
  element_type?: string
}

export interface CrystalsAPIResponse {
  crystals: Crystal[]
  totalPages: number
  currentPage: number
  totalItems?: number
}

export interface CrystalAPIResponse {
  crystal: CrystalProduct | null
  error?: string
}
