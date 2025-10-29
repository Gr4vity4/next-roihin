import { NextRequest, NextResponse } from 'next/server'

import { buildLaravelApiUrl } from '@/config/api.config'
import { getCacheHeaders, getFetchConfig } from '@/config/cache.config'
import {
  normalizeStoneCollection,
  stoneToCrystal,
} from '@/lib/server/crystal-transform'
import type { Crystal, CrystalLocale } from '@/lib/types/crystal'
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

function matchesSearch(crystal: Crystal, query: string): boolean {
  const haystack = [
    crystal.title,
    crystal.subtitle,
    crystal.category,
    ...(crystal.story?.connectedChakras ?? []),
    ...(crystal.story?.ascendant ?? []),
    crystal.story?.energyElement,
    ...(crystal.story?.starRelations ?? []),
  ]

  return haystack.some((value) => (value || '').toLowerCase().includes(query))
}

function applyElementFilter(crystals: Crystal[], filterValue: string | null): Crystal[] {
  if (!filterValue) {
    return crystals
  }

  const requestedElements = filterValue
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter((value) => value.length > 0)

  if (requestedElements.length === 0) {
    return crystals
  }

  return crystals.filter((crystal) => {
    const element = crystal.story?.energyElement?.toLowerCase() ?? ''
    if (!element) {
      return false
    }

    return requestedElements.some((requested) => element.includes(requested))
  })
}

function applyZodiacFilter(crystals: Crystal[], filterValue: string | null): Crystal[] {
  if (!filterValue) {
    return crystals
  }

  const requestedZodiacs = filterValue
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter((value) => value.length > 0)

  if (requestedZodiacs.length === 0) {
    return crystals
  }

  return crystals.filter((crystal) => {
    const ascendant = crystal.story?.ascendant ?? []
    if (ascendant.length === 0) {
      return false
    }

    const normalizedAscendant = ascendant.map((value) => value.toLowerCase())
    return requestedZodiacs.some((requested) =>
      normalizedAscendant.some((candidate) => candidate.includes(requested)),
    )
  })
}

function applySearchFilter(crystals: Crystal[], query: string | null): Crystal[] {
  if (!query) {
    return crystals
  }

  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) {
    return crystals
  }

  return crystals.filter((crystal) => matchesSearch(crystal, normalizedQuery))
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const locale = parseLocale(searchParams.get('lang') || searchParams.get('locale'))
  const page = parsePositiveInteger(searchParams.get('page'), 1)
  const perPage = parsePositiveInteger(searchParams.get('per_page'), DEFAULT_PER_PAGE)
  const searchQuery = searchParams.get('search')
  const elementFilter = searchParams.get('element_type')
  const zodiacFilter = searchParams.get('zodiac_signs')

  try {
    const queryParams: Record<string, string> = {
      locale,
      lang: locale,
      per_page: '100',
    }

    const category = searchParams.get('category')
    if (category) {
      queryParams.category = category
    }

    const url = buildLaravelApiUrl('/stones', queryParams)

    const response = await fetch(url, getFetchConfig('api'))

    if (!response.ok) {
      throw new Error(`Failed to fetch crystals: ${response.status}`)
    }

    const payload = await response.json()
    const stones = normalizeStoneCollection(payload)
    const crystals = stones.map((stone) => stoneToCrystal(stone, locale))

    let filtered = applySearchFilter(crystals, searchQuery)
    filtered = applyElementFilter(filtered, elementFilter)
    filtered = applyZodiacFilter(filtered, zodiacFilter)

    const totalItems = filtered.length
    const totalPages = Math.max(1, Math.ceil(totalItems / perPage))
    const currentPage = Math.min(page, totalPages)
    const startIndex = (currentPage - 1) * perPage
    const paginated = filtered.slice(startIndex, startIndex + perPage)

    return NextResponse.json(
      {
        crystals: paginated,
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
