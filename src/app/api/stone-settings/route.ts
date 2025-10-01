import { NextRequest, NextResponse } from 'next/server'
import { getFetchConfig, getCacheHeaders } from '@/config/cache.config'
import { getWordPressApiUrl, getApiBasePath } from '@/config/api.config'
import { StonesResponseSchema } from '@/lib/types/api-types'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const language = (searchParams.get('lang') || 'en') as 'en' | 'th'
    
    const apiUrl = getWordPressApiUrl(language)
    const basePath = getApiBasePath()
    
    // Updated endpoint from stone-setting to stone
    const response = await fetch(
      `${apiUrl}${basePath}/stone?_fields=acf`,
      getFetchConfig('siteSettings')
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch stone settings: ${response.status}`)
    }

    const rawData = await response.json()
    const data = StonesResponseSchema.parse(rawData)
    
    return NextResponse.json(data, {
      headers: getCacheHeaders(),
    })
  } catch (error) {
    console.error('Error fetching stone settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stone settings' },
      { status: 500, headers: getCacheHeaders() }
    )
  }
}