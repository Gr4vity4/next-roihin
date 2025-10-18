import { NextResponse } from 'next/server'
import { getAuthToken } from '@/lib/auth/get-token'
import { removeWishlistItem } from '@/lib/api/wishlist'

interface Props {
  params: Promise<{ id: string }>
}

export async function DELETE(request: Request, { params }: Props) {
  try {
    await params
    const token = await getAuthToken()
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json().catch(() => null)
    const productIdRaw = body?.product_id ?? null
    const productId = typeof productIdRaw === 'number' ? productIdRaw : parseInt(productIdRaw ?? '', 10)
    const color = body?.color ?? null
    const colorOptionId = body?.product_color_option_id ?? body?.color_option_id ?? null

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    await removeWishlistItem(token, {
      productId,
      color,
      colorOptionId,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Wishlist item removal error:', error)
    return NextResponse.json(
      { error: 'Failed to remove wishlist item' },
      { status: 500 }
    )
  }
}
