const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL || 'https://wp-roihin.precisiondevlab.com'

export async function POST(request: Request) {
  try {
    const { first_name, last_name, email, phone, password, accept_terms } = await request.json()
    
    // Send phone in multiple fields to ensure WordPress receives it
    const requestBody = {
      first_name,
      last_name,
      email,
      phone_number: phone,
      phone: phone, // Also send as 'phone' field
      billing_phone: phone, // Also send as WooCommerce billing field
      password,
      accept_terms
    }
    
    console.log('Sending registration request to WordPress:', requestBody)
    
    const response = await fetch(`${WORDPRESS_API_URL}/wp-json/roihin/v1/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    const data = await response.json()

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: data.message || 'Registration failed' }),
        { status: response.status }
      )
    }
    
    // Ensure phone is returned in the response
    const responseData = {
      ...data,
      phone: data.phone || data.phone_number || phone || '',
      phone_number: data.phone_number || data.phone || phone || ''
    }

    return Response.json(responseData, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    )
  }
}