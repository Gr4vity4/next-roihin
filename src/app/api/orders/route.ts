import { NextResponse } from 'next/server'
import { getAuthToken } from '@/lib/auth/get-token'
import { createOrder, fetchOrders } from '@/lib/api/orders'
import type { CreateOrderPayload } from '@/lib/api/orders'
import { getErrorMessage } from '@/lib/utils/error-handler'

export async function GET() {
  try {
    const token = await getAuthToken()

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await fetchOrders(token)
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.error('Orders GET error:', error)
    return NextResponse.json(
      { error: getErrorMessage(error, 'Failed to load orders') },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const token = await getAuthToken()

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = (await request.json().catch(() => null)) as CreateOrderPayload | null

    if (!payload) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const data = await createOrder(token, payload)
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.error('Orders POST error:', error)
    return NextResponse.json(
      { error: getErrorMessage(error, 'Failed to create order') },
      { status: 400 }
    )
  }
}
