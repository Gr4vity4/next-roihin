export interface StoneStory {
  energy_element: string
  connected_chakras: string
  ascendant: string
  star_relations: string
}

export interface SizePricing {
  size_6_mm?: {
    base_price: string
  }
  size_8_mm?: {
    base_price: string
  }
  size_10_mm?: {
    base_price: string
  }
  size_12_mm?: {
    base_price: string
  }
}

export interface StoneInformation {
  stone_image: string
  stone_title: string
  stone_sub_title: string
  stone_description: string
  stone_story: StoneStory
  category: string // "1" = หิน, "2" = ชาร์ม, "3" = ตัวคั่น/จี้
  ''?: SizePricing // The API returns an empty string as key for size pricing
}

export interface StoneSetting {
  acf: {
    stone_information: StoneInformation
  }
}

export const STONE_CATEGORIES = {
  '1': 'หิน',
  '2': 'ชาร์ม', 
  '3': 'ตัวคั่น/จี้'
} as const

export type StoneCategory = keyof typeof STONE_CATEGORIES