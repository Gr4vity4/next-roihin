import { Metadata } from 'next'
import NavigationWithSuspense from '@/components/NavigationWithSuspense'
import ChatWidget from '@/components/ChatWidget'
import { Footer } from '@/components/sections'
import CheckoutContent from '@/components/sections/CheckoutContent'

export const metadata: Metadata = {
  title: 'ตะกร้าสินค้า | Roihin Thailand',
  description: 'ตะกร้าสินค้าและการชำระเงิน',
}

export default function CheckoutPage() {
  return (
    <>
      <NavigationWithSuspense position="static" />
      
      <main className="min-h-screen bg-black">
        <CheckoutContent />
      </main>

      <Footer />
      <ChatWidget />
    </>
  )
}