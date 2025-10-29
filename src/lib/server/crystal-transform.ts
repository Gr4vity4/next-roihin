import { LARAVEL_API_URL } from '@/config/api.config'
import type {
  Crystal,
  CrystalLocale,
  CrystalProduct,
  CrystalSizePricing,
  CrystalStory,
} from '@/lib/types/crystal'

interface RawStoneRecord {
  [key: string]: unknown
}

interface NormalizedStone {
  id: number
  title: string
  subtitle: string
  description: string
  story: CrystalStory
  category: string
  stoneImage: string
  previewImage: string
  sizePrices: CrystalSizePricing
}

const ASSET_KEYS = ['url', 'full_url', 'fullUrl', 'original_url', 'originalUrl', 'path', 'storage_path']

function toNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string') {
    const parsed = Number(value)
    if (!Number.isNaN(parsed)) {
      return parsed
    }
  }

  return null
}

function toString(value: unknown): string {
  if (typeof value === 'string') {
    return value.trim()
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  return ''
}

function formatPrice(value: unknown): string | undefined {
  if (value === undefined || value === null) {
    return undefined
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return value.toFixed(2)
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) {
      return undefined
    }

    const parsed = Number(trimmed)
    if (!Number.isNaN(parsed)) {
      return parsed.toFixed(2)
    }

    return trimmed
  }

  return undefined
}

function resolveAssetUrl(raw: string): string {
  const value = raw.trim()
  if (!value) {
    return ''
  }

  if (/^https?:\/\//i.test(value)) {
    return value
  }

  if (value.startsWith('//')) {
    return `https:${value}`
  }

  const baseUrl = (LARAVEL_API_URL || '').replace(/\/$/, '')
  const normalizedPath = value.replace(/^\/+/, '')

  if (!baseUrl) {
    return `/${normalizedPath}`
  }

  if (normalizedPath.startsWith('storage/')) {
    return `${baseUrl}/${normalizedPath}`
  }

  if (normalizedPath.startsWith('public/')) {
    const withoutPublic = normalizedPath.replace(/^public\//, '')
    return `${baseUrl}/storage/${withoutPublic}`
  }

  return `${baseUrl}/storage/${normalizedPath}`
}

function extractAssetUrl(source: unknown): string {
  if (typeof source === 'string') {
    return resolveAssetUrl(source)
  }

  if (typeof source === 'object' && source !== null) {
    const record = source as Record<string, unknown>

    for (const key of ASSET_KEYS) {
      const value = record[key]
      if (typeof value === 'string' && value.trim() !== '') {
        return resolveAssetUrl(value)
      }
    }

    if (record.data && typeof record.data === 'object') {
      return extractAssetUrl(record.data)
    }
  }

  return ''
}

function splitList(value: unknown): string[] {
  if (typeof value !== 'string') {
    return []
  }

  return value
    .split(/[\n\r,;、|\/]+/u)
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
}

function normalizeStory(raw: unknown): CrystalStory {
  if (typeof raw !== 'object' || raw === null) {
    return {
      energyElement: '',
      connectedChakras: [],
      ascendant: [],
      starRelations: [],
    }
  }

  const record = raw as Record<string, unknown>

  return {
    energyElement: toString(record.energy_element ?? record.energyElement ?? record.element),
    connectedChakras: splitList(record.connected_chakras ?? record.connectedChakras ?? record.chakras),
    ascendant: splitList(record.ascendant ?? record.ascendant_sign ?? record.ascendantSign),
    starRelations: splitList(record.star_relations ?? record.starRelations ?? record.star_relation),
  }
}

function normalizeSizePrices(raw: unknown): CrystalSizePricing {
  if (typeof raw !== 'object' || raw === null) {
    return {}
  }

  const record = raw as Record<string, unknown>

  return {
    size6mm: formatPrice(
      record.size_6_mm_base_price ??
        record.size6 ??
        record.size_6 ??
        record.size_6_price ??
        record.price_6mm,
    ),
    size8mm: formatPrice(
      record.size_8_mm_base_price ??
        record.size8 ??
        record.size_8 ??
        record.size_8_price ??
        record.price_8mm,
    ),
    size10mm: formatPrice(
      record.size_10_mm_base_price ??
        record.size10 ??
        record.size_10 ??
        record.size_10_price ??
        record.price_10mm,
    ),
    size12mm: formatPrice(
      record.size_12_mm_base_price ??
        record.size12 ??
        record.size_12 ??
        record.size_12_price ??
        record.price_12mm,
    ),
  }
}

function normalizeStone(raw: unknown): NormalizedStone | null {
  if (typeof raw !== 'object' || raw === null) {
    return null
  }

  const record = raw as RawStoneRecord
  const id = toNumber(record.id)

  if (id === null) {
    return null
  }

  const title =
    toString(record.title ?? record.name ?? record.slug) || `Crystal ${id}`

  const subtitle = toString(record.sub_title ?? record.subtitle ?? record.subTitle)
  const description = toString(record.description ?? '')
  const story = normalizeStory(
    record.story ?? record.story_json ?? record.storyJson ?? record.story_data,
  )

  const category = toString(record.category ?? '')

  const primaryImage = extractAssetUrl(record.preview_image ?? record.previewImage)
  const fallbackImage = extractAssetUrl(record.stone_image ?? record.crystal_image)

  const previewImage = primaryImage || fallbackImage
  const stoneImage = fallbackImage || primaryImage

  const sizePrices = normalizeSizePrices(record.size_prices ?? record.sizePrices)

  return {
    id,
    title,
    subtitle,
    description,
    story,
    category,
    stoneImage,
    previewImage,
    sizePrices,
  }
}

export function normalizeStoneCollection(payload: unknown): NormalizedStone[] {
  const collections: unknown[] = []

  if (Array.isArray(payload)) {
    collections.push(...payload)
  } else if (payload && typeof payload === 'object') {
    const root = payload as Record<string, unknown>
    if (Array.isArray(root.data)) {
      collections.push(...root.data)
    } else if (
      root.data &&
      typeof root.data === 'object' &&
      Array.isArray((root.data as Record<string, unknown>).data)
    ) {
      collections.push(...((root.data as Record<string, unknown>).data as unknown[]))
    }
  }

  return collections
    .map((item) => normalizeStone(item))
    .filter((item): item is NormalizedStone => item !== null)
}

export function normalizeSingleStone(payload: unknown): NormalizedStone | null {
  if (payload && typeof payload === 'object') {
    const root = payload as Record<string, unknown>
    if (root.data) {
      return normalizeStone(root.data)
    }
  }

  return normalizeStone(payload)
}

function splitParagraphs(value: string): string[] {
  return value
    .split(/\r?\n\r?\n+/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0)
}

function slugify(value: string): string {
  const normalized = value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')

  return normalized || 'crystal'
}

export function createCrystalSlug(title: string, id: number): string {
  return `${slugify(title)}-${id}`
}

export function extractIdFromSlug(slug: string): number | null {
  if (!slug) {
    return null
  }

  const match = slug.match(/-(\d+)$/)
  if (match) {
    return Number(match[1])
  }

  if (/^\d+$/.test(slug)) {
    return Number(slug)
  }

  return null
}

export function stoneToCrystal(stone: NormalizedStone, locale: CrystalLocale): Crystal {
  const slug = createCrystalSlug(stone.title || stone.subtitle || `crystal-${stone.id}`, stone.id)

  return {
    id: String(stone.id),
    slug,
    title: stone.title || `Crystal ${stone.id}`,
    subtitle: stone.subtitle || undefined,
    image: stone.previewImage || stone.stoneImage || '',
    previewImage: stone.previewImage || stone.stoneImage || undefined,
    category: stone.category || undefined,
    locale,
    story: stone.story,
    sizePrices: stone.sizePrices,
  }
}

export function stoneToCrystalProduct(
  stone: NormalizedStone,
  locale: CrystalLocale,
  slugOverride?: string,
): CrystalProduct {
  const base = stoneToCrystal(stone, locale)

  return {
    ...base,
    slug: slugOverride ?? base.slug,
    story: stone.story,
    sizePrices: {
      size6mm: stone.sizePrices.size6mm,
      size8mm: stone.sizePrices.size8mm,
      size10mm: stone.sizePrices.size10mm,
      size12mm: stone.sizePrices.size12mm,
    },
    description: splitParagraphs(stone.description),
  }
}
