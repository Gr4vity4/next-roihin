export interface ShopCollectionDefinition {
  slug: string
  category: string
}

export const SHOP_COLLECTIONS: ShopCollectionDefinition[] = [
  { slug: 'bracelet', category: 'Bracelet' },
  { slug: 'ring', category: 'Ring' },
  { slug: 'earring', category: 'Earring' },
  { slug: 'pandents', category: 'Pandents' },
  { slug: 'nacklace', category: 'Nacklace' },
  { slug: 'rough-crystal', category: 'Rough Crystal' },
  { slug: 'perfume', category: 'Perfume' },
  { slug: 'gifts', category: 'Gifts' }
]

export function getShopCollection(slug: string) {
  return SHOP_COLLECTIONS.find((collection) => collection.slug === slug)
}
