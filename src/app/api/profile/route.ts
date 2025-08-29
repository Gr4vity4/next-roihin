import { getProfile, updateProfile } from '@/lib/api/profile'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const profile = await getProfile()
    return NextResponse.json(profile)
  } catch (error) {
    console.error('Failed to fetch profile:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch profile' },
      { status: 401 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const profile = await updateProfile(body)
    return NextResponse.json(profile)
  } catch (error) {
    console.error('Failed to update profile:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update profile' },
      { status: 400 }
    )
  }
}