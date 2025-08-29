const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL || 'https://wp-roihin.precisiondevlab.com'

export async function POST(request: Request) {
  try {
    const { first_name, last_name, email, phone, password, accept_terms } = await request.json()
    
    const response = await fetch(`${WORDPRESS_API_URL}/wp-json/roihin/v1/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ first_name, last_name, email, phone, password, accept_terms }),
    })

    const data = await response.json()

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: data.message || 'Registration failed' }),
        { status: response.status }
      )
    }

    return Response.json(data, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    )
  }
}