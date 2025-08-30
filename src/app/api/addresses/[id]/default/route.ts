import { setDefaultAddress } from '@/lib/api/addresses'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const result = await setDefaultAddress(id)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Failed to set default address:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to set default address' },
      { status: 400 }
    )
  }
}