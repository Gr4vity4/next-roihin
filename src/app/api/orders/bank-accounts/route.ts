import { NextResponse } from 'next/server'
import { getBankAccounts } from '@/lib/api/orders'

export async function GET() {
  try {
    const result = await getBankAccounts()
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Bank accounts fetch error:', error)
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Failed to fetch bank accounts' },
      { status: 500 }
    )
  }
}