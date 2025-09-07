import { cookies } from 'next/headers'
import { checkFavorite } from '@/lib/api/wishlist'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('product')
    const color = searchParams.get('color')
    
    if (!productId) {
      return Response.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const cookieStore = await cookies()
    const token = cookieStore.get('wpToken')?.value

    if (!token) {
      return Response.json(
        { error: 'Not authenticated', favorite: false },
        { status: 200 }
      )
    }

    const response = await checkFavorite(
      token, 
      parseInt(productId),
      color || undefined
    )
    
    return Response.json(response)
  } catch (error) {
    console.error('Error checking favorite status:', error)
    return Response.json(
      { error: 'Failed to check favorite status', favorite: false },
      { status: 200 }
    )
  }
}