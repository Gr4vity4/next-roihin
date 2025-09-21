import NavigationWithSuspense from '@/components/NavigationWithSuspense'
import { Footer } from '@/components/sections'
import BraceletOrderForm from '@/components/sections/BraceletOrderForm'
import { Metadata } from 'next'

export const revalidate = 900

export const metadata: Metadata = {
  title: 'สั่งออกแบบกำไลหินเฉพาะบุคคล - ROIHIN STONE & BRACELET',
  description: 'ฟอร์มสั่งออกแบบกำไลหินตามเดือนเกิด และพลังหินที่เหมาะกับคุณ',
  openGraph: {
    title: 'สั่งออกแบบกำไลหินเฉพาะบุคคล - ROIHIN STONE & BRACELET',
    description: 'ฟอร์มสั่งออกแบบกำไลหินตามเดือนเกิด และพลังหินที่เหมาะกับคุณ',
    images: [
      {
        url: '/images/357c3a_d5bbbe07a2cb43579ad4d33c6279ff5a~mv2.jpg',
        width: 1200,
        height: 630,
        alt: 'Personalized Stone Bracelet Order Form',
      },
    ],
  },
}

export default function BraceletOrderPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <NavigationWithSuspense />

      {/* Order Form Section */}
      <BraceletOrderForm />

      {/* Footer */}
      <Footer />
    </main>
  )
}