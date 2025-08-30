import { NextResponse } from 'next/server'
import { getAuthToken } from '@/lib/auth/get-token'
import { checkWishlistItem, checkMultipleWishlistItems } from '@/lib/api/wishlist'

export async function GET(request: Request) {
  try {
    const token = await getAuthToken()
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const ids = searchParams.get('ids')
    const productId = searchParams.get('product_id')
    const color = searchParams.get('color')

    if (ids) {
      const productIds = ids.split(',').map(id => parseInt(id, 10))
      const result = await checkMultipleWishlistItems(token, productIds, color || undefined)
      return NextResponse.json(result)
    } else if (productId) {
      const result = await checkWishlistItem(token, parseInt(productId, 10), color || undefined)
      return NextResponse.json(result)
    } else {
      return NextResponse.json(
        { error: 'Product ID or IDs required' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Wishlist check error:', error)
    return NextResponse.json(
      { error: 'Failed to check wishlist' },
      { status: 500 }
    )
  }
}