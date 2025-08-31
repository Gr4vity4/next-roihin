import { NextRequest, NextResponse } from 'next/server'
import { createOrder } from '@/lib/api/orders'
import type { OrderCreateRequest } from '@/lib/types/order'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as OrderCreateRequest
    
    const result = await createOrder(body)
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Failed to create order' },
      { status: 500 }
    )
  }
}