import { NextRequest, NextResponse } from 'next/server'

import { buildLaravelApiUrl } from '@/config/api.config'
import { getCacheHeaders, getFetchConfig } from '@/config/cache.config'
import { sortProductsByDisplayOrder } from '@/lib/api/products'
import { getErrorMessage } from '@/lib/utils/error-handler'

interface RouteParams {
  params: Promise<{
    slug: string
  }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params
  const searchParams = request.nextUrl.searchParams
  const locale = searchParams.get('lang') || searchParams.get('locale') || 'en'
  const perPage =
    searchParams.get('per_page')?.trim() ||
    searchParams.get('perPage')?.trim() ||
    undefined

  try {
    // per_page omitted → CMS returns all related products
    const url = buildLaravelApiUrl(`/crystals/${encodeURIComponent(slug)}/related-products`, {
      locale,
      per_page: perPage,
    })

    const response = await fetch(url, getFetchConfig('api'))

    if (response.status === 404) {
      return NextResponse.json(
        { error: 'Crystal not found' },
        { status: 404, headers: getCacheHeaders() },
      )
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch related products: ${response.status}`)
    }

    const result = await response.json()
    const rawProducts = Array.isArray(result) ? result : result.data
    const products = Array.isArray(rawProducts)
      ? sortProductsByDisplayOrder(rawProducts)
      : []

    return NextResponse.json(products, {
      headers: getCacheHeaders(),
    })
  } catch (error) {
    console.error(`Error fetching related products for crystal "${slug}":`, error)
    return NextResponse.json(
      { error: getErrorMessage(error, 'Failed to fetch related products') },
      { status: 500, headers: getCacheHeaders() },
    )
  }
}
