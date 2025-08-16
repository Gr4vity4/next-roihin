import { NextResponse } from 'next/server'
import { getFetchConfig, getCacheHeaders } from '@/config/cache.config'

const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL || 'https://wp-roihin.precisiondevlab.com'

export async function GET() {
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/wp-json/wp/v2/stone-setting?_fields=acf`,
      getFetchConfig()
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch stone settings: ${response.status}`)
    }

    const data = await response.json()
    
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