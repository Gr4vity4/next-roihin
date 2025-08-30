import { Metadata } from 'next'
import Navigation from '@/components/Navigation'
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
      <Navigation position="static" />
      
      <main className="min-h-screen bg-black">
        <CheckoutContent />
      </main>

      <Footer />
      <ChatWidget />
    </>
  )
}