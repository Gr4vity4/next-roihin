import { NextResponse } from 'next/server'
import { getAuthToken } from '@/lib/auth/get-token'
import { toggleWishlist } from '@/lib/api/wishlist'
import { getErrorMessage } from '@/lib/utils/error-handler'

export async function POST(request: Request) {
  try {
    const token = await getAuthToken()
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { product_id, color, color_option_id, op } = body

    if (!product_id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const result = await toggleWishlist({
      token,
      productId: product_id,
      color,
      colorOptionId: color_option_id ?? null,
      op,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Wishlist toggle error:', error)
    return NextResponse.json(
      { error: getErrorMessage(error, 'Failed to toggle wishlist') },
      { status: 500 }
    )
  }
}
