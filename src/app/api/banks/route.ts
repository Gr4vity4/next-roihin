import { getCacheHeaders, getFetchConfig } from '@/config/cache.config'
import { getWordPressApiUrl, getApiBasePath } from '@/config/api.config'
import { BanksResponseSchema } from '@/lib/types/api-types'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const language = (searchParams.get('lang') || 'en') as 'en' | 'th'
    
    const apiUrl = getWordPressApiUrl(language)
    const basePath = getApiBasePath()
    
    const response = await fetch(
      `${apiUrl}${basePath}/bank?_fields=acf`,
      getFetchConfig('api')
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch banks: ${response.status}`)
    }

    const data = await response.json()
    const banks = BanksResponseSchema.parse(data)

    return NextResponse.json(banks, {
      headers: getCacheHeaders(),
    })
  } catch (error) {
    console.error('Error fetching banks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch banks' },
      { status: 500, headers: getCacheHeaders() }
    )
  }
}