import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = await cookies()
  cookieStore.delete('wpToken')
  
  return Response.json({ message: 'Logged out successfully' })
}