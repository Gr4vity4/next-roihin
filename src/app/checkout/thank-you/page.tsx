import { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import ChatWidget from '@/components/ChatWidget'
import { Footer } from '@/components/sections'
import ThankYouContent from '@/components/sections/ThankYouContent'

export const metadata: Metadata = {
  title: 'ขอบคุณสำหรับการสั่งซื้อ | Roihin Thailand',
  description: 'ขอบคุณสำหรับการสั่งซื้อ เราจะดำเนินการจัดส่งสินค้าให้คุณโดยเร็วที่สุด',
}

export default function ThankYouPage() {
  return (
    <>
      <Navigation position="static" />
      
      <main className="min-h-screen bg-black">
        <ThankYouContent />
      </main>

      <Footer />
      <ChatWidget />
    </>
  )
}