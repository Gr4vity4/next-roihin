import { NextRequest, NextResponse } from 'next/server'
import { getFetchConfig, getCacheHeaders } from '@/config/cache.config'
import { buildLaravelApiUrl } from '@/config/api.config'
import { getErrorMessage } from '@/lib/utils/error-handler'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const locale = searchParams.get('lang') || searchParams.get('locale') || 'en'

    const url = buildLaravelApiUrl('/products', {
      locale,
      per_page: '100',
    })

    const response = await fetch(url, getFetchConfig('api'))

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`)
    }

    const result = await response.json()
    const products = result.data || result

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
