import { NextResponse } from 'next/server'
import { getAuthToken } from '@/lib/auth/get-token'
import { cancelOrder } from '@/lib/api/orders'
import { getErrorMessage } from '@/lib/utils/error-handler'

interface RouteParams {
  params: { orderId: string }
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const token = await getAuthToken()

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await request.json().catch(() => ({}))
    const data = await cancelOrder(token, params.orderId, payload)
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.error('Order cancel POST error:', error)
    return NextResponse.json(
      { error: getErrorMessage(error, 'Failed to cancel order') },
      { status: 400 }
    )
  }
}
