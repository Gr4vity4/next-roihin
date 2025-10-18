import { NextResponse } from 'next/server'
import { getAuthToken } from '@/lib/auth/get-token'
import { fetchWishlist } from '@/lib/api/wishlist'
import { getErrorMessage } from '@/lib/utils/error-handler'

export async function GET(request: Request) {
  try {
    const token = await getAuthToken()

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const productParam = searchParams.get('product')
    const colorParam = searchParams.get('color')

    const productId = productParam ? Number(productParam) : NaN

    if (!productParam || Number.isNaN(productId)) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const wishlist = await fetchWishlist(token)
    const normalizedColor = colorParam ?? null

    const match = wishlist.items.find(item => {
      const itemColor = item.color ?? null
      return item.product_id === productId && itemColor === normalizedColor
    })

    return NextResponse.json({
      favorite: Boolean(match),
      item_id: match?.id ?? null,
      product_color_option_id: match?.product_color_option_id ?? null,
    })
  } catch (error) {
    console.error('Wishlist check-favorite error:', error)
    return NextResponse.json(
      { error: getErrorMessage(error, 'Failed to check favorite') },
      { status: 500 }
    )
  }
}
