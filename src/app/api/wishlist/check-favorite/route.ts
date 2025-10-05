import { checkFavorite } from '@/lib/api/wishlist'
import { getAuthToken } from '@/lib/auth/get-token'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('product')
    const color = searchParams.get('color')

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    const token = await getAuthToken()

    if (!token) {
      return NextResponse.json({ favorite: false, item_id: null }, { status: 200 })
    }

    const result = await checkFavorite(token, parseInt(productId), color || undefined)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Failed to check favorite:', error)
    return NextResponse.json({ favorite: false, item_id: null }, { status: 200 })
  }
}
