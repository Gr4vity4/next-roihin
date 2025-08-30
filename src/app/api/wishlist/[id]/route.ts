import { NextResponse } from 'next/server'
import { getAuthToken } from '@/lib/auth/get-token'
import { removeWishlistItem } from '@/lib/api/wishlist'

interface Props {
  params: Promise<{ id: string }>
}

export async function DELETE(_request: Request, { params }: Props) {
  try {
    const { id } = await params
    const token = await getAuthToken()
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await removeWishlistItem(token, id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Wishlist item removal error:', error)
    return NextResponse.json(
      { error: 'Failed to remove wishlist item' },
      { status: 500 }
    )
  }
}