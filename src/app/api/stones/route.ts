import { getCacheHeaders, getFetchConfig } from '@/config/cache.config'
import { NextResponse } from 'next/server'

const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL || 'https://wp-roihin.precisiondevlab.com'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lang = searchParams.get('lang') || 'th'
  
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/wp-json/wp/v2/stone?_fields=acf&per_page=100&lang=${lang}`,
      getFetchConfig('api')
    )
    
    if (!response.ok) {
      throw new Error(`Failed to fetch stones: ${response.status}`)
    }
    
    const stones = await response.json()
    
    return NextResponse.json(stones, {
      headers: getCacheHeaders(),
    })
  } catch (error) {
    console.error('Error fetching stones:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stones' },
      { status: 500, headers: getCacheHeaders() }
    )
  }
}