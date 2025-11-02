import { redirect } from 'next/navigation'

import NavigationWithSuspense from '@/components/NavigationWithSuspense'
import { Footer } from '@/components/sections'
import ChatWidget from '@/components/ChatWidget'
import { Container } from '@/components/ui'
import { getAuthToken } from '@/lib/auth/get-token'
import { getLaravelApiEndpoint } from '@/config/api.config'

async function ensureAuthenticated() {
  const token = await getAuthToken()

  if (!token) {
    return false
  }

  try {
    const response = await fetch(getLaravelApiEndpoint('/auth/me'), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      cache: 'no-store',
    })

    if (response.status === 401 || response.status === 403 || response.status === 419) {
      return false
    }

    return response.ok
  } catch (error) {
    console.error('Failed to validate auth session for member area:', error)
    return false
  }
}

export default async function MemberLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale?: string }
}) {
  const isAuthenticated = await ensureAuthenticated()

  if (!isAuthenticated) {
    const locale = params?.locale || ''
    redirect(locale ? `/${locale}` : '/')
  }

  return (
    <>
      <NavigationWithSuspense />
      
      <main className="min-h-screen bg-gray-50 pt-20 lg:pt-[230px] pb-16">
        <Container>
          {children}
        </Container>
      </main>

      <Footer />
      <ChatWidget />
    </>
  )
}
