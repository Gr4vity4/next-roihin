import { NextRequest, NextResponse } from 'next/server'

import { buildLaravelApiUrl } from '@/config/api.config'
import { getCacheHeaders, getFetchConfig } from '@/config/cache.config'
import {
  crystalRecordToProduct,
  normalizeSingleCrystal,
} from '@/lib/server/crystal-transform'
import type { CrystalLocale } from '@/lib/types/crystal'
import { getErrorMessage } from '@/lib/utils/error-handler'

function parseLocale(value: string | null): CrystalLocale {
  return value === 'th' ? 'th' : 'en'
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

interface RouteParams {
  params: Promise<{
    slug: string
  }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params
  const searchParams = request.nextUrl.searchParams
  const locale = parseLocale(searchParams.get('lang') || searchParams.get('locale'))

  try {
    const url = buildLaravelApiUrl(`/crystals/${slug}`, {
      locale,
    })

    const response = await fetch(url, getFetchConfig('api'))

    if (response.status === 404) {
      return NextResponse.json(
        { crystal: null },
        { status: 404, headers: getCacheHeaders() },
      )
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch crystal: ${response.status}`)
    }

    const payload = await response.json()

    const resolvedLocale = resolveResponseLocale(payload, locale)
    const crystal = normalizeSingleCrystal(payload, resolvedLocale)

    if (!crystal) {
      return NextResponse.json(
        { crystal: null },
        { status: 404, headers: getCacheHeaders() },
      )
    }

    const product = crystalRecordToProduct(crystal)

    return NextResponse.json(
      { crystal: product },
      { headers: getCacheHeaders() },
    )
  } catch (error) {
    console.error(`Error fetching crystal with slug "${slug}":`, error)
    return NextResponse.json(
      { error: getErrorMessage(error, 'Failed to fetch crystal') },
      { status: 500, headers: getCacheHeaders() },
    )
  }
}
