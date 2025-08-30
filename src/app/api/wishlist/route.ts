import { NextResponse } from 'next/server'
import { getAuthToken } from '@/lib/auth/get-token'
import { fetchWishlist, clearWishlist } from '@/lib/api/wishlist'

export async function GET() {
  try {
    const token = await getAuthToken()
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const wishlist = await fetchWishlist(token)
    return NextResponse.json(wishlist)
  } catch (error) {
    if (error instanceof Error && error.message === 'AUTH') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    console.error('Wishlist fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    const token = await getAuthToken()
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await clearWishlist(token)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Wishlist clear error:', error)
    return NextResponse.json(
      { error: 'Failed to clear wishlist' },
      { status: 500 }
    )
  }
}