import NavigationWithSuspense from '@/components/NavigationWithSuspense'
import { Footer } from '@/components/sections'
import ChatWidget from '@/components/ChatWidget'
import { Container } from '@/components/ui'

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode
}) {
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