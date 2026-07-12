import BraceletDesigner from '@/components/BraceletDesigner'
import ChatWidget from '@/components/ChatWidget'
// import LatestDIYCreations from '@/components/LatestDIYCreations'
import NavigationWithSuspense from '@/components/NavigationWithSuspense'
import { Footer } from '@/components/sections'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Custom Bracelet Designer | ROIHIN',
  description: 'Design your own personalized stone bracelet with our interactive designer',
}

export default function CustomPage() {
  return (
    <>
      <NavigationWithSuspense />
      <main className="min-h-screen pt-24">
        <div className="px-4 md:px-8">
          <BraceletDesigner />
        </div>
        {/* Hidden for now — restore by uncommenting this and the import above */}
        {/* <LatestDIYCreations /> */}
      </main>
      {/* Footer */}
      <Footer />
      {/* Chat Widget */}
      <ChatWidget />
    </>
  )
}
