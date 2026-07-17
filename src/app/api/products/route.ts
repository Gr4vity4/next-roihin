import { NextRequest, NextResponse } from 'next/server'
import { getFetchConfig, getCacheHeaders } from '@/config/cache.config'
import { buildLaravelApiUrl } from '@/config/api.config'
import { getErrorMessage } from '@/lib/utils/error-handler'
import { sortProductsByDisplayOrder } from '@/lib/api/products'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const locale = searchParams.get('lang') || searchParams.get('locale') || 'en'
    const category = searchParams.get('category')?.trim() || undefined
    const crystalId =
      searchParams.get('crystal_id')?.trim() ||
      searchParams.get('crystalId')?.trim() ||
      undefined
    const perPage = searchParams.get('per_page') || searchParams.get('perPage') || '100'

    const url = buildLaravelApiUrl('/products', {
      locale,
      per_page: perPage,
      category,
      crystal_id: crystalId,
    })

    const response = await fetch(url, getFetchConfig('api'))

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`)
    }

    const result = await response.json()
    const rawProducts = result.data || result
    const products = Array.isArray(rawProducts)
      ? sortProductsByDisplayOrder(rawProducts)
      : rawProducts

    return NextResponse.json(products, {
      headers: getCacheHeaders(),
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: getErrorMessage(error, 'Failed to fetch products') },
      { status: 500, headers: getCacheHeaders() }
    )
  }
}
