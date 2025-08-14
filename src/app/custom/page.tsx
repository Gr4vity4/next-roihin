import BraceletDesigner from '@/components/BraceletDesigner'
import ChatWidget from '@/components/ChatWidget'
import Navigation from '@/components/Navigation'
import { Footer } from '@/components/sections'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Custom Bracelet Designer | ROIHIN',
  description: 'Design your own personalized stone bracelet with our interactive designer',
}

export default function CustomPage() {
  return (
    <>
      <Navigation />
      <main className="h-screen pt-20 lg:pt-[230px]">
        <BraceletDesigner />
      </main>
      {/* Footer */}
      <Footer />
      {/* Chat Widget */}
      <ChatWidget />
    </>
  )
}
