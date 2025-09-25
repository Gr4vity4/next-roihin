import { NextRequest, NextResponse } from 'next/server'
import { getFetchConfig, getCacheHeaders } from '@/config/cache.config'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const language = searchParams.get('lang') || 'en'

    // Get webhook URL from environment or use default
    const webhookUrl = process.env.NEXT_PUBLIC_ROIHIN_WEBHOOK_URL ||
      'https://n8n.systemtechdesign.com/webhook/a52ab2c4-54f0-4745-a716-e7f237f2417f/roihin'

    // Fetch from webhook API
    const response = await fetch(
      `${webhookUrl}/${language}/options-page-bracelet-base-price`,
      {
        ...getFetchConfig('api'),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch base price: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json(data, {
      headers: getCacheHeaders(),
    })
  } catch (error) {
    console.error('Error fetching bracelet base price:', error)
    // Return default value instead of error to prevent frontend issues
    return NextResponse.json(
      { bracelet_design_base_price: '0' },
      {
        status: 200,
        headers: getCacheHeaders()
      }
    )
  }
}