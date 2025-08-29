import { NextRequest, NextResponse } from 'next/server'

const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL || 'https://wp-roihin.precisiondevlab.com'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const response = await fetch(`${WORDPRESS_API_URL}/wp-json/roihin/v1/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Registration failed' },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}