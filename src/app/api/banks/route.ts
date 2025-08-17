import { getCacheHeaders, getFetchConfig } from '@/config/cache.config'
import type { BankData } from '@/lib/types/bank'
import { NextResponse } from 'next/server'

const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL || 'https://wp-roihin.precisiondevlab.com'

export async function GET() {
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/wp-json/wp/v2/bank?_fields=acf`,
      getFetchConfig('api')
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch banks: ${response.status}`)
    }

    const banks: BankData[] = await response.json()

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