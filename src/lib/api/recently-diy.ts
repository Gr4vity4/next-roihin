import { getFetchConfig } from '@/config/cache.config'
import { buildLaravelApiUrl } from '@/config/api.config'
import { diyCreations as fallbackCreations } from '@/lib/data/diy-creations'
import { DIYCreation } from '@/lib/types/diy-creation'
import {
  LaravelRecentlyDiyResponseSchema,
  type LaravelRecentlyDiy,
  type LaravelRecentlyDiyStone,
} from '@/lib/types/laravel'

const FALLBACK_IMAGE = fallbackCreations[0]?.thumbnail ?? '/images/custom-creations/creation-1.jpg'

const normalizeLocaleField = (
  value: { en?: string | null; th?: string | null } | undefined,
  locale: 'en' | 'th'
): string => {
  const preferred = locale === 'en' ? value?.en : value?.th
  const fallback = locale === 'en' ? value?.th : value?.en

  return (preferred ?? fallback ?? '').toString().trim()
}

function mapStone(stone: LaravelRecentlyDiyStone) {
  return {
    name: normalizeLocaleField(stone.name, 'en'),
    nameTh: normalizeLocaleField(stone.name, 'th'),
    energy: normalizeLocaleField(stone.energy, 'en'),
    energyTh: normalizeLocaleField(stone.energy, 'th'),
  }
}

export function mapRecentlyDiyToCreation(
  item: LaravelRecentlyDiy,
  fallbackImage: string = FALLBACK_IMAGE
): DIYCreation {
  const stones = (item.stones ?? [])
    .slice()
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map(mapStone)

  const createdAt = item.designed_at ?? item.created_at ?? new Date().toISOString()

  return {
    id: item.id.toString(),
    title: normalizeLocaleField(item.title, 'en') || normalizeLocaleField(item.title, 'th'),
    titleTh: normalizeLocaleField(item.title, 'th') || normalizeLocaleField(item.title, 'en'),
    thumbnail: item.image_url ?? fallbackImage,
    designerName: normalizeLocaleField(item.designer_name, 'en') || normalizeLocaleField(item.designer_name, 'th'),
    designerNameTh: normalizeLocaleField(item.designer_name, 'th') || normalizeLocaleField(item.designer_name, 'en'),
    stones,
    price: typeof item.price === 'number' ? item.price : 0,
    description: normalizeLocaleField(item.description, 'en') || normalizeLocaleField(item.description, 'th'),
    descriptionTh: normalizeLocaleField(item.description, 'th') || normalizeLocaleField(item.description, 'en'),
    createdAt,
  }
}

export async function fetchRecentlyDiyDesigns(
  limit: number = 8,
  locale: 'th' | 'en' = 'th'
): Promise<DIYCreation[]> {
  try {
    const url = buildLaravelApiUrl('recently-diy', { limit, locale })
    const fetchConfig = getFetchConfig('gallery') as Record<string, unknown>
    const baseHeaders = (fetchConfig.headers as Record<string, string>) || {}
    const response = await fetch(url, {
      ...fetchConfig,
      headers: {
        ...baseHeaders,
        'Accept-Language': locale,
      },
    })

    if (!response.ok) {
      console.error(`Failed to fetch Recently DIY: ${response.status} ${response.statusText}`)
      return []
    }

    const json = await response.json()
    const parsed = LaravelRecentlyDiyResponseSchema.safeParse(json)

    if (!parsed.success) {
      console.error('Invalid Recently DIY response', parsed.error)
      return []
    }

    const items = parsed.data.data ?? []

    return items
      .filter(item => item.is_published !== false)
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map(item => mapRecentlyDiyToCreation(item))
  } catch (error) {
    console.error('Error fetching Recently DIY', error)
    return []
  }
}
