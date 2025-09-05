import { Metadata } from 'next'
import NavigationWithSuspense from '@/components/NavigationWithSuspense'
import ChatWidget from '@/components/ChatWidget'
import { Footer } from '@/components/sections'
import CheckoutConfirmContent from '@/components/sections/CheckoutConfirmContent'

export const metadata: Metadata = {
  title: 'ยืนยันการสั่งซื้อ | Roihin Thailand',
  description: 'ยืนยันที่อยู่จัดส่งและการชำระเงิน',
}

export default function CheckoutConfirmPage() {
  return (
    <>
      <NavigationWithSuspense position="static" />
      
      <main className="min-h-screen bg-black">
        <CheckoutConfirmContent />
      </main>

      <Footer />
      <ChatWidget />
    </>
  )
}