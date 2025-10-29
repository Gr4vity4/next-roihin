import { NextRequest, NextResponse } from 'next/server'

import { buildLaravelApiUrl } from '@/config/api.config'
import { getCacheHeaders, getFetchConfig } from '@/config/cache.config'
import {
  extractIdFromSlug,
  normalizeSingleStone,
  stoneToCrystalProduct,
} from '@/lib/server/crystal-transform'
import type { CrystalLocale } from '@/lib/types/crystal'
import { getErrorMessage } from '@/lib/utils/error-handler'

function parseLocale(value: string | null): CrystalLocale {
  return value === 'th' ? 'th' : 'en'
}

interface RouteParams {
  params: {
    slug: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const slug = params.slug
  const searchParams = request.nextUrl.searchParams
  const locale = parseLocale(searchParams.get('lang') || searchParams.get('locale'))

  const crystalId = extractIdFromSlug(slug)
  if (!crystalId) {
    return NextResponse.json(
      { error: 'Invalid crystal identifier' },
      { status: 400, headers: getCacheHeaders() },
    )
  }

  try {
    const url = buildLaravelApiUrl(`/stones/${crystalId}`, {
      locale,
      lang: locale,
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
    const stone = normalizeSingleStone(payload)

    if (!stone) {
      return NextResponse.json(
        { crystal: null },
        { status: 404, headers: getCacheHeaders() },
      )
    }

    const product = stoneToCrystalProduct(stone, locale, slug)

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
