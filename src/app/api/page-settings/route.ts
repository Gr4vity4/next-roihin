import { NextRequest, NextResponse } from 'next/server'
import { getFetchConfig, getCacheHeaders } from '@/config/cache.config'
import { getWordPressApiUrl, getApiBasePath } from '@/config/api.config'
import { PageSettingsResponseSchema } from '@/lib/types/api-types'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const language = (searchParams.get('lang') || 'en') as 'en' | 'th'
    
    const apiUrl = getWordPressApiUrl(language)
    const basePath = getApiBasePath()
    
    // Updated endpoint from pagesetting to page-setting
    const response = await fetch(
      `${apiUrl}${basePath}/page-setting?_fields=acf`,
      getFetchConfig('siteSettings')
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch page settings: ${response.status}`)
    }

    const data = await response.json()
    const pageSettings = PageSettingsResponseSchema.parse(data)

    return NextResponse.json(pageSettings, {
      headers: getCacheHeaders(),
    })
  } catch (error) {
    console.error('Error fetching page settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch page settings' },
      { status: 500, headers: getCacheHeaders() }
    )
  }
}