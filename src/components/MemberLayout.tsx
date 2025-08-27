import Navigation from '@/components/Navigation'
import { Footer } from '@/components/sections'
import MemberSidebar from '@/components/MemberSidebar'
import ChatWidget from '@/components/ChatWidget'

interface MemberLayoutProps {
  children: React.ReactNode
}

export default function MemberLayout({ children }: MemberLayoutProps) {
  return (
    <>
      <Navigation />
      
      <main className="min-h-screen bg-gray-50 pt-20 lg:pt-[230px]">
        <div className="flex">
          <MemberSidebar />
          <div className="flex-1 lg:ml-0">
            <div className="p-6 lg:p-8">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <ChatWidget />
    </>
  )
}