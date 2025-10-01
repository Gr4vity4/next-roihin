import { NextRequest, NextResponse } from 'next/server'
import { getFetchConfig, getCacheHeaders } from '@/config/cache.config'
import { getWordPressApiUrl, getApiBasePath } from '@/config/api.config'
import { ProductsResponseSchema } from '@/lib/types/api-types'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const language = (searchParams.get('lang') || 'en') as 'en' | 'th'
    
    const apiUrl = getWordPressApiUrl(language)
    const basePath = getApiBasePath()
    
    const response = await fetch(
      `${apiUrl}${basePath}/product?_fields=acf`,
      getFetchConfig('api')
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`)
    }

    const data = await response.json()
    const products = ProductsResponseSchema.parse(data)

    return NextResponse.json(products, {
      headers: getCacheHeaders(),
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500, headers: getCacheHeaders() }
    )
  }
}