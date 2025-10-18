import { getCacheHeaders, getFetchConfig } from '@/config/cache.config'
import { NextResponse } from 'next/server'
import { buildLaravelApiUrl } from '@/config/api.config'
import { getErrorMessage } from '@/lib/utils/error-handler'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const locale = searchParams.get('lang') || searchParams.get('locale') || 'en'
  const category = searchParams.get('category')

  try {
    const params: Record<string, string> = {
      locale,
      per_page: '100',
    }

    if (category) {
      params.category = category
    }

    const url = buildLaravelApiUrl('/stones', params)

    const response = await fetch(url, getFetchConfig('api'))

    if (!response.ok) {
      throw new Error(`Failed to fetch stones: ${response.status}`)
    }

    const result = await response.json()
    const stones = result.data || result

    return NextResponse.json(stones, {
      headers: getCacheHeaders(),
    })
  } catch (error) {
    console.error('Error fetching stones:', error)
    return NextResponse.json(
      { error: getErrorMessage(error, 'Failed to fetch stones') },
      { status: 500, headers: getCacheHeaders() }
    )
  }
}
