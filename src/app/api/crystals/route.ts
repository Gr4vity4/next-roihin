import { NextRequest, NextResponse } from 'next/server'

import { buildLaravelApiUrl } from '@/config/api.config'
import { getCacheHeaders, getFetchConfig } from '@/config/cache.config'
import {
  crystalRecordToListItem,
  normalizeCrystalCollection,
} from '@/lib/server/crystal-transform'
import type { CrystalLocale } from '@/lib/types/crystal'
import { getErrorMessage } from '@/lib/utils/error-handler'

const DEFAULT_PER_PAGE = 20

function parseLocale(value: string | null): CrystalLocale {
  return value === 'th' ? 'th' : 'en'
}

function parsePositiveInteger(value: string | null, fallback: number): number {
  if (!value) {
    return fallback
  }

  const parsed = Number(value)
  if (Number.isNaN(parsed) || parsed < 1) {
    return fallback
  }

  return Math.floor(parsed)
}

function resolveResponseLocale(payload: unknown, fallback: CrystalLocale): CrystalLocale {
  if (payload && typeof payload === 'object') {
    const meta = (payload as { meta?: { locale?: unknown } }).meta
    if (meta && typeof meta.locale === 'string') {
      return parseLocale(meta.locale)
    }
  }

  return fallback
}

function collectMultiValueParam(
  params: URLSearchParams,
  keys: string[],
  options?: { splitOnComma?: boolean },
): string[] | undefined {
  // Energy purpose values contain commas ("Love, Happiness & Luck"), so
  // callers pass splitOnComma: false for them and send repeated `key[]`
  // params instead of a comma-joined string.
  const splitOnComma = options?.splitOnComma ?? true
  const values = new Set<string>()

  const add = (raw: string) => {
    const pieces = splitOnComma ? raw.split(',') : [raw]
    pieces
      .map((value) => value.trim())
      .filter((value) => value.length > 0)
      .forEach((value) => values.add(value))
  }

  keys.forEach((key) => {
    params.getAll(key).forEach(add)

    const arrayKey = key.endsWith('[]') ? key : `${key}[]`
    params.getAll(arrayKey).forEach(add)
  })

  if (values.size === 0) {
    return undefined
  }

  return Array.from(values)
}

function buildBackendQuery(
  searchParams: URLSearchParams,
  baseLocale: CrystalLocale,
  perPage: number,
  page: number,
): Record<string, string | string[]> {
  let locale = baseLocale

  const query: Record<string, string | string[]> = {
    locale,
    lang: locale,
    per_page: String(perPage),
    page: String(page),
  }

  const search = searchParams.get('search')
  if (search) {
    query.search = search
  }

  // Multi-value filters are forwarded to the CMS in `key[]` array form; a
  // comma-joined single param would split comma-containing values. Sending
  // the CMS's `colors` param must be avoided: it matches the (always-null)
  // `color` column and ANDs with tone_colors, emptying every result.
  const toneColors = collectMultiValueParam(searchParams, [
    'tone_colors',
    'toneColors',
    'color_filter',
    'colorFilter',
    'colors',
  ])
  if (toneColors) {
    query.tone_colors = toneColors
  }

  const energyPurposes = collectMultiValueParam(
    searchParams,
    ['energy_purposes', 'energyProperties', 'energy_properties'],
    { splitOnComma: false },
  )
  if (energyPurposes) {
    query.energy_purposes = energyPurposes
  }

  const energyElements = collectMultiValueParam(searchParams, [
    'energy_elements',
    'element_type',
    'elementType',
  ])
  if (energyElements) {
    query.energy_elements = energyElements
  }

  const zodiacSigns = collectMultiValueParam(searchParams, ['zodiac_signs', 'zodiacSigns'])
  if (zodiacSigns) {
    query.zodiac_signs = zodiacSigns
  }

  const zodiacGroups = collectMultiValueParam(searchParams, ['primary_zodiac_groups', 'primaryZodiacGroups'])
  if (zodiacGroups) {
    query.primary_zodiac_groups = zodiacGroups
  }

  const localeOverride = searchParams.get('locale')
  if (localeOverride) {
    locale = parseLocale(localeOverride)
    query.locale = locale
    query.lang = locale
  }

  const pageOverride = searchParams.get('page')
  if (pageOverride) {
    query.page = String(parsePositiveInteger(pageOverride, page))
  }

  const perPageOverride = searchParams.get('per_page')
  if (perPageOverride) {
    query.per_page = String(parsePositiveInteger(perPageOverride, perPage))
  }

  const category = searchParams.get('category')
  if (category) {
    query.category = category
  }

  return query
}

function parsePagination(payload: unknown) {
  if (!payload || typeof payload !== 'object') {
    return null
  }

  const pagination = (payload as { meta?: { pagination?: Record<string, unknown> } }).meta?.pagination
  if (!pagination || typeof pagination !== 'object') {
    return null
  }

  const record = pagination as Record<string, unknown>

  const toNumberOrUndefined = (value: unknown) => {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : undefined
  }

  return {
    total: toNumberOrUndefined(record.total),
    perPage: toNumberOrUndefined(record.per_page ?? record.perPage),
    currentPage: toNumberOrUndefined(record.current_page ?? record.currentPage),
    lastPage: toNumberOrUndefined(record.last_page ?? record.lastPage),
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const requestedLocale = parseLocale(searchParams.get('lang') || searchParams.get('locale'))
  const requestedPage = parsePositiveInteger(searchParams.get('page'), 1)
  const requestedPerPage = parsePositiveInteger(searchParams.get('per_page'), DEFAULT_PER_PAGE)

  try {
    const url = buildLaravelApiUrl(
      '/crystals',
      buildBackendQuery(searchParams, requestedLocale, requestedPerPage, requestedPage),
    )

    const response = await fetch(url, getFetchConfig('api'))

    if (!response.ok) {
      throw new Error(`Failed to fetch crystals: ${response.status}`)
    }

    const payload = await response.json()
    const responseLocale = resolveResponseLocale(payload, requestedLocale)
    const normalizedRecords = normalizeCrystalCollection(payload, responseLocale)
    const crystals = normalizedRecords.map((record) => crystalRecordToListItem(record))

    const pagination = parsePagination(payload)

    const totalItems = pagination?.total ?? crystals.length
    const totalPages = pagination?.lastPage ?? Math.max(1, Math.ceil(totalItems / requestedPerPage))
    const currentPage = pagination?.currentPage ?? requestedPage

    return NextResponse.json(
      {
        crystals,
        totalPages,
        currentPage,
        totalItems,
      },
      {
        headers: getCacheHeaders(),
      },
    )
  } catch (error) {
    console.error('Error fetching crystals:', error)
    return NextResponse.json(
      { error: getErrorMessage(error, 'Failed to fetch crystals') },
      { status: 500, headers: getCacheHeaders() },
    )
  }
}
