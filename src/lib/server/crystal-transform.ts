import { LARAVEL_API_URL } from '@/config/api.config'
import type {
  Crystal,
  CrystalLocale,
  CrystalProduct,
  CrystalSizePricing,
  CrystalStory,
} from '@/lib/types/crystal'

type RawCrystalRecord = Record<string, unknown>

interface NormalizedCrystalRecord {
  id: string
  slug: string
  title: string
  subtitle?: string
  category?: string
  image: string
  previewImage?: string
  color?: string
  toneColors?: string[]
  locale: CrystalLocale
  story: CrystalStory
  sizePrices: CrystalSizePricing
  description: string[]
}

interface CrystalTranslationBlock {
  name?: string
  chakra?: string
  ruling_star?: string
  description?: string
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

function normalizeList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => toString(item))
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
  }

  const stringValue = toString(value)
  if (!stringValue) {
    return []
  }

  return stringValue
    .split(/[\n\r,;、|\/]+/u)
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
}

function splitParagraphs(value: string): string[] {
  return value
    .split(/\r?\n\r?\n+/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0)
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

function selectTranslation(
  translations: unknown,
  locale: CrystalLocale,
): { data: CrystalTranslationBlock; fallback: CrystalTranslationBlock } {
  if (typeof translations !== 'object' || translations === null) {
    return { data: {}, fallback: {} }
  }

  const record = translations as Record<string, unknown>
  const primary = record[locale]

  const oppositeLocale: CrystalLocale = locale === 'th' ? 'en' : 'th'
  const secondary = record[oppositeLocale] ?? record.en ?? record.th

  const toBlock = (input: unknown): CrystalTranslationBlock => {
    if (typeof input !== 'object' || input === null) {
      return {}
    }

    const block = input as Record<string, unknown>

    return {
      name: toString(block.name ?? block.title),
      chakra: toString(block.chakra),
      ruling_star: toString(block.ruling_star ?? block.rulingStar),
      description: toString(block.description),
    }
  }

  return {
    data: toBlock(primary),
    fallback: toBlock(secondary),
  }
}

function humanizeSlug(value: string): string {
  return value
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^./, (char) => char.toUpperCase())
}

function normalizeCrystalRecord(raw: unknown, locale: CrystalLocale): NormalizedCrystalRecord | null {
  if (typeof raw !== 'object' || raw === null) {
    return null
  }

  const record = raw as RawCrystalRecord

  const idNumber = toNumber(record.id)
  if (idNumber === null) {
    return null
  }

  const slug = toString(record.slug) || `crystal-${idNumber}`

  const { data: translation, fallback } = selectTranslation(record.translations, locale)

  const titleCandidate = translation.name || fallback.name || toString(record.name)
  const title = titleCandidate || humanizeSlug(slug) || `Crystal ${idNumber}`

  const chakraValues = normalizeList(record.chakra ?? translation.chakra ?? fallback.chakra)
  const ascendantValues = normalizeList(
    record.ascendant ?? record.ascendant_sign ?? record.ascendantSign ?? record.ascendant_zodiac,
  )
  const zodiacValues = normalizeList(record.zodiac_signs ?? record.zodiacSigns)
  const resolvedAscendant = ascendantValues.length > 0 ? ascendantValues : zodiacValues

  const rulingStarValues = normalizeList(
    record.ruling_star ?? record.rulingStar ?? translation.ruling_star ?? fallback.ruling_star,
  )

  const energyValues = normalizeList(record.energy_element ?? record.energyElement)
  const energyElement = energyValues.join(', ')

  const toneColorValues = normalizeList(record.tone_colors ?? record.toneColors)

  const color =
    toString(record.color ?? record.primary_color ?? record.primaryColor ?? toneColorValues[0]) ||
    undefined

  const coverImage =
    extractAssetUrl(record.cover_image_url ?? record.cover_image ?? record.coverImage) || ''
  const crystalImage =
    extractAssetUrl(record.crystal_image_url ?? record.crystal_image ?? record.crystalImage) || ''

  const primaryImage = crystalImage || coverImage
  const previewImage = coverImage || crystalImage

  const descriptionSource = translation.description || fallback.description || toString(record.description)

  const story: CrystalStory = {
    energyElement,
    connectedChakras: chakraValues,
    ascendant: resolvedAscendant,
    starRelations: rulingStarValues,
  }

  const category = toString(record.category ?? '') || undefined
  const subtitle = chakraValues[0] || toneColorValues[0] || undefined

  const sizePrices = normalizeSizePrices(record.size_prices ?? record.sizePrices)

  return {
    id: String(idNumber),
    slug,
    title,
    subtitle,
    category,
    image: primaryImage,
    previewImage: previewImage || undefined,
    color,
    toneColors: toneColorValues.length > 0 ? toneColorValues : undefined,
    locale,
    story,
    sizePrices,
    description: splitParagraphs(descriptionSource),
  }
}

export function normalizeCrystalCollection(
  payload: unknown,
  locale: CrystalLocale,
): NormalizedCrystalRecord[] {
  const items: unknown[] = []

  if (Array.isArray(payload)) {
    items.push(...payload)
  } else if (payload && typeof payload === 'object') {
    const root = payload as Record<string, unknown>
    if (Array.isArray(root.data)) {
      items.push(...root.data)
    }
  }

  return items
    .map((item) => normalizeCrystalRecord(item, locale))
    .filter((item): item is NormalizedCrystalRecord => item !== null)
}

export function normalizeSingleCrystal(
  payload: unknown,
  locale: CrystalLocale,
): NormalizedCrystalRecord | null {
  if (payload && typeof payload === 'object') {
    const root = payload as Record<string, unknown>
    if (root.data) {
      return normalizeCrystalRecord(root.data, locale)
    }
  }

  return normalizeCrystalRecord(payload, locale)
}

export function crystalRecordToListItem(crystal: NormalizedCrystalRecord): Crystal {
  return {
    id: crystal.id,
    slug: crystal.slug,
    title: crystal.title,
    subtitle: crystal.subtitle,
    image: crystal.image,
    previewImage: crystal.previewImage,
    category: crystal.category,
    color: crystal.color,
    toneColors: crystal.toneColors,
    locale: crystal.locale,
    story: crystal.story,
    sizePrices: Object.keys(crystal.sizePrices).length > 0 ? crystal.sizePrices : undefined,
  }
}

export function crystalRecordToProduct(crystal: NormalizedCrystalRecord): CrystalProduct {
  return {
    ...crystalRecordToListItem(crystal),
    story: crystal.story,
    sizePrices: crystal.sizePrices,
    description: crystal.description,
  }
}
