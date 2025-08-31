import { NextRequest, NextResponse } from 'next/server'
import { getOrder } from '@/lib/api/orders'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const searchParams = request.nextUrl.searchParams
    const orderKey = searchParams.get('key')
    
    if (!orderKey) {
      return NextResponse.json(
        { ok: false, error: 'Order key is required' },
        { status: 400 }
      )
    }
    
    const result = await getOrder(id, orderKey)
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Order fetch error:', error)
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Failed to fetch order' },
      { status: 500 }
    )
  }
}