import { listAddresses, createAddress } from '@/lib/api/addresses'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const addresses = await listAddresses()
    return NextResponse.json(addresses)
  } catch (error) {
    console.error('Failed to fetch addresses:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch addresses' },
      { status: 401 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const address = await createAddress(body)
    return NextResponse.json(address)
  } catch (error) {
    console.error('Failed to create address:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create address' },
      { status: 400 }
    )
  }
}