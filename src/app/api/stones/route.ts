import { NextResponse } from 'next/server'
import { buildLaravelApiUrl, LARAVEL_API_URL } from '@/config/api.config'
import { getErrorMessage } from '@/lib/utils/error-handler'
import { StoneSchema, type Stone } from '@/lib/types/api-types'

interface RawStoneRecord {
  [key: string]: unknown
}

const DEFAULT_SIZE_VALUE = '-1'

const SIZE_KEY_MAP: Record<string, string[]> = {
  size_6_mm_base_price: [
    'size_6_mm_base_price',
    'size6',
    'size_6',
    'six_mm',
    'six',
    'size6mm',
    'size_6_mm',
    'size_6_mm_price',
    'price_6mm',
  ],
  size_8_mm_base_price: [
    'size_8_mm_base_price',
    'size8',
    'size_8',
    'eight_mm',
    'eight',
    'size8mm',
    'size_8_mm',
    'size_8_mm_price',
    'price_8mm',
  ],
  size_10_mm_base_price: [
    'size_10_mm_base_price',
    'size10',
    'size_10',
    'ten_mm',
    'ten',
    'size10mm',
    'size_10_mm',
    'size_10_mm_price',
    'price_10mm',
  ],
  size_12_mm_base_price: [
    'size_12_mm_base_price',
    'size12',
    'size_12',
    'twelve_mm',
    'twelve',
    'size12mm',
    'size_12_mm',
    'size_12_mm_price',
    'price_12mm',
  ],
}

const STORY_KEYS = {
  energy_element: ['energy_element', 'energyElement', 'element'],
  connected_chakras: ['connected_chakras', 'connectedChakras', 'chakra', 'chakras'],
  ascendant: ['ascendant', 'ascendant_sign', 'ascendantSign'],
  star_relations: ['star_relations', 'starRelations', 'star_relation'],
} as const

const CATEGORY_KEYS = ['category', 'type', 'stone_category', 'stoneCategory']

const IMAGE_KEYS = {
  stone: ['stone_image', 'stoneImage', 'image', 'stoneImageUrl'],
  preview: ['preview_image', 'previewImage', 'thumbnail', 'previewImageUrl'],
} as const

const ASSET_OBJECT_KEYS = ['url', 'full_url', 'fullUrl', 'original_url', 'originalUrl', 'path', 'storage_path'] as const

function resolveAssetUrl(raw: unknown): string {
  if (typeof raw !== 'string' || raw.trim() === '') {
    return ''
  }

  const value = raw.trim()

  if (/^https?:\/\//i.test(value)) {
    return value
  }

  if (value.startsWith('//')) {
    return `https:${value}`
  }

  const baseUrl = LARAVEL_API_URL?.replace(/\/$/, '')

  const normalizedPath = value.replace(/^\/+/, '')

  let storagePath = normalizedPath

  if (normalizedPath.startsWith('public/')) {
    storagePath = normalizedPath.replace(/^public\//, 'storage/')
  } else if (!normalizedPath.startsWith('storage/')) {
    storagePath = `storage/${normalizedPath}`
  }

  const pathWithLeadingSlash = `/${storagePath}`

  if (!baseUrl) {
    return pathWithLeadingSlash
  }

  return `${baseUrl}${pathWithLeadingSlash}`
}

function parseJson<T>(value: unknown): T | undefined {
  if (typeof value !== 'string') {
    return undefined
  }

  try {
    return JSON.parse(value) as T
  } catch {
    return undefined
  }
}

function extractFromArray<T extends Record<string, unknown>>(
  collection: unknown,
  predicate: (item: T) => boolean,
  valueSelector: (item: T) => unknown,
): unknown {
  if (!Array.isArray(collection)) {
    return undefined
  }

  for (const element of collection) {
    if (typeof element !== 'object' || element === null) continue
    const record = element as T
    if (predicate(record)) {
      return valueSelector(record)
    }
  }

  return undefined
}

function toStringOrEmpty(value: unknown): string {
  if (value === undefined || value === null) {
    return ''
  }

  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  return ''
}

function extractImage(source: RawStoneRecord, keys: readonly string[]): string {
  for (const key of keys) {
    const value = source[key]
    if (typeof value === 'string' && value.trim() !== '') {
      return resolveAssetUrl(value)
    }

    if (typeof value === 'object' && value !== null) {
      const assetRecord = value as Record<string, unknown>

      for (const assetKey of ASSET_OBJECT_KEYS) {
        const assetValue = assetRecord[assetKey]
        if (typeof assetValue === 'string' && assetValue.trim() !== '') {
          return resolveAssetUrl(assetValue)
        }
      }

      const nestedData = assetRecord.data
      if (typeof nestedData === 'object' && nestedData !== null) {
        for (const assetKey of ASSET_OBJECT_KEYS) {
          const nestedValue = (nestedData as Record<string, unknown>)[assetKey]
          if (typeof nestedValue === 'string' && nestedValue.trim() !== '') {
            return resolveAssetUrl(nestedValue)
          }
        }
      }
    }
  }

  return ''
}

function extractCategory(source: RawStoneRecord): string {
  for (const key of CATEGORY_KEYS) {
    const raw = source[key]

    if (!raw) continue

    if (typeof raw === 'string') {
      return raw
    }

    if (typeof raw === 'object') {
      const record = raw as Record<string, unknown>
      const value = record.name || record.value || record.slug || record.label

      if (typeof value === 'string' && value.trim() !== '') {
        return value
      }
    }
  }

  return ''
}

function extractStory(source: RawStoneRecord): Record<string, string> {
  const candidates = [
    source.story,
    source.story_json,
    source.storyJson,
    source.acf instanceof Object ? (source.acf as Record<string, unknown>).story : undefined,
  ]

  for (const candidate of candidates) {
    const storyObject =
      typeof candidate === 'string'
        ? parseJson<Record<string, unknown>>(candidate)
        : (candidate as Record<string, unknown> | undefined)

    if (!storyObject) continue

    return {
      energy_element: toStringOrEmpty(
        STORY_KEYS.energy_element
          .map((key) => storyObject[key])
          .find((value) => value !== undefined && value !== null),
      ),
      connected_chakras: toStringOrEmpty(
        STORY_KEYS.connected_chakras
          .map((key) => storyObject[key])
          .find((value) => value !== undefined && value !== null),
      ),
      ascendant: toStringOrEmpty(
        STORY_KEYS.ascendant
          .map((key) => storyObject[key])
          .find((value) => value !== undefined && value !== null),
      ),
      star_relations: toStringOrEmpty(
        STORY_KEYS.star_relations
          .map((key) => storyObject[key])
          .find((value) => value !== undefined && value !== null),
      ),
    }
  }

  return {
    energy_element: '',
    connected_chakras: '',
    ascendant: '',
    star_relations: '',
  }
}

function matchSizeFromObject(candidate: RawStoneRecord | undefined, keyList: string[]): string | undefined {
  if (!candidate) return undefined

  for (const key of keyList) {
    const value = candidate[key]
    if (value === undefined || value === null || value === '') continue
    return String(value)
  }

  return undefined
}

function matchSizeFromArray(candidate: unknown, size: string): string | undefined {
  return extractFromArray<Record<string, unknown>>(
    candidate,
    (item) => {
      const sizeKey = item.size ?? item.size_mm ?? item.sizeMM ?? item.slug ?? item.id
      if (!sizeKey) return false
      return String(sizeKey).replace(/[^0-9]/g, '') === size
    },
    (item) => item.base_price ?? item.price ?? item.value ?? item.amount,
  ) as string | undefined
}

function extractSizeValue(source: RawStoneRecord, sizeKey: keyof typeof SIZE_KEY_MAP, sizeNumber: string): string {
  const candidates = [
    source.size,
    source.size_prices,
    source.sizePrices,
    source.prices,
    source.pricing,
    source.price_list,
    source.priceList,
    source.acf instanceof Object ? (source.acf as Record<string, unknown>).size : undefined,
  ]

  for (const candidate of candidates) {
    if (!candidate) continue

    if (Array.isArray(candidate)) {
      const value = matchSizeFromArray(candidate, sizeNumber)
      if (value !== undefined) {
        return String(value)
      }
      continue
    }

    if (typeof candidate === 'string') {
      const parsed = parseJson<Record<string, unknown>>(candidate)
      if (parsed) {
        const value = matchSizeFromObject(parsed, SIZE_KEY_MAP[sizeKey])
        if (value !== undefined) return value
      }
      continue
    }

    if (typeof candidate === 'object' && candidate !== null) {
      const value = matchSizeFromObject(candidate as RawStoneRecord, SIZE_KEY_MAP[sizeKey])
      if (value !== undefined) {
        return value
      }
    }
  }

  return DEFAULT_SIZE_VALUE
}

function normalizeStoneRecord(raw: RawStoneRecord): Stone | null {
  const baseRecord = raw.attributes && typeof raw.attributes === 'object'
    ? { ...raw, ...(raw.attributes as Record<string, unknown>) }
    : raw

  // If the API already provides an ACF-compliant object, validate and return it
  const parsedExisting = StoneSchema.safeParse(baseRecord)
  if (parsedExisting.success) {
    return parsedExisting.data
  }

  const candidate = {
    acf: {
      stone_image: extractImage(baseRecord, IMAGE_KEYS.stone),
      preview_image: extractImage(baseRecord, IMAGE_KEYS.preview) || extractImage(baseRecord, IMAGE_KEYS.stone),
      title: toStringOrEmpty(baseRecord.title ?? baseRecord.name ?? baseRecord.slug),
      sub_title: toStringOrEmpty(baseRecord.sub_title ?? baseRecord.subtitle ?? baseRecord.subTitle),
      description: toStringOrEmpty(baseRecord.description ?? baseRecord.content ?? baseRecord.body),
      story: extractStory(baseRecord),
      category: extractCategory(baseRecord),
      size: {
        size_6_mm_base_price: extractSizeValue(baseRecord, 'size_6_mm_base_price', '6'),
        size_8_mm_base_price: extractSizeValue(baseRecord, 'size_8_mm_base_price', '8'),
        size_10_mm_base_price: extractSizeValue(baseRecord, 'size_10_mm_base_price', '10'),
        size_12_mm_base_price: extractSizeValue(baseRecord, 'size_12_mm_base_price', '12'),
      },
    },
  }

  const parsedCandidate = StoneSchema.safeParse(candidate)

  if (parsedCandidate.success) {
    return parsedCandidate.data
  }

  console.warn('Unable to normalize stone record', {
    errors: parsedCandidate.error.flatten(),
    raw: baseRecord,
  })

  return null
}

function normalizeStoneCollection(result: unknown): Stone[] {
  const primary = (result as { data?: unknown }).data
  const nested =
    primary && typeof primary === 'object' && !Array.isArray(primary)
      ? (primary as { data?: unknown }).data
      : undefined

  const collection = Array.isArray(primary)
    ? (primary as RawStoneRecord[])
    : Array.isArray(nested)
      ? (nested as RawStoneRecord[])
      : Array.isArray(result)
        ? (result as RawStoneRecord[])
        : []

  return collection
    .map((item) => normalizeStoneRecord(item))
    .filter((item): item is Stone => item !== null)
}

type StonesFetchResult = {
  stones: Stone[]
  endpoint: string
}

async function fetchStonesFromEndpoint(
  endpoint: string,
  params: Record<string, string>,
): Promise<StonesFetchResult> {
  const url = buildLaravelApiUrl(endpoint, params)
  const response = await fetch(url, { cache: 'no-store' })

  if (!response.ok) {
    const httpError = new Error(`Failed to fetch stones from ${endpoint}: ${response.status}`)
    throw Object.assign(httpError, {
      status: response.status,
      endpoint,
    })
  }

  const result = await response.json()
  const stones = normalizeStoneCollection(result)

  return {
    stones,
    endpoint,
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const locale = searchParams.get('lang') || searchParams.get('locale') || 'en'
  const category = searchParams.get('category')

  try {
    const params: Record<string, string> = {
      locale,
      per_page: '100',
      lang: locale,
    }

    if (category) {
      params.category = category
    }

    const endpoints = ['/admin/stones', '/stones']
    const errors: string[] = []

    for (const endpoint of endpoints) {
      try {
        const { stones, endpoint: usedEndpoint } = await fetchStonesFromEndpoint(endpoint, params)

        if (usedEndpoint !== '/admin/stones') {
          console.warn('Falling back to legacy stones endpoint', { endpoint: usedEndpoint })
        }

        return NextResponse.json(stones, {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        })
      } catch (error) {
        const message = getErrorMessage(error, `Failed to fetch stones from ${endpoint}`)
        errors.push(message)
        console.error('Stones endpoint failure', {
          endpoint,
          error: message,
        })
      }
    }

    console.error('Unable to load stones from any endpoint', { errors })

    return NextResponse.json(
      {
        error: 'Failed to fetch stones',
        reasons: errors,
      },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      },
    )
  } catch (error) {
    console.error('Error fetching stones:', error)
    return NextResponse.json(
      { error: getErrorMessage(error, 'Failed to fetch stones') },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      }
    )
  }
}
