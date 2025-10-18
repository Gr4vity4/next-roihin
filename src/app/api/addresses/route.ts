import { NextResponse } from 'next/server'
import { getAuthToken } from '@/lib/auth/get-token'
import { fetchAddresses, createAddress } from '@/lib/api/addresses'
import { getErrorMessage } from '@/lib/utils/error-handler'

export async function GET() {
  try {
    const token = await getAuthToken()

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await fetchAddresses(token)
    return NextResponse.json(data)
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.error('Addresses GET error:', error)
    return NextResponse.json(
      { error: getErrorMessage(error, 'Failed to load addresses') },
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

    const payload = await request.json()
    const data = await createAddress(token, payload)
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Addresses POST error:', error)
    return NextResponse.json(
      { error: getErrorMessage(error, 'Failed to create address') },
      { status: 400 }
    )
  }
}
