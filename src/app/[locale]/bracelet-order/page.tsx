import NavigationWithSuspense from '@/components/NavigationWithSuspense'
import { Footer } from '@/components/sections'
import BraceletOrderForm from '@/components/sections/BraceletOrderForm'
import { REVALIDATE_SEMI_STATIC } from '@/config/cache.config'
import { Metadata } from 'next'

export const revalidate = REVALIDATE_SEMI_STATIC

export const metadata: Metadata = {
  title: 'สั่งออกแบบกำไลหินเฉพาะบุคคล - ROIHIN STONE & BRACELET',
  description: 'ฟอร์มสั่งออกแบบกำไลหินตามเดือนเกิด และพลังหินที่เหมาะกับคุณ',
  openGraph: {
    title: 'สั่งออกแบบกำไลหินเฉพาะบุคคล - ROIHIN STONE & BRACELET',
    description: 'ฟอร์มสั่งออกแบบกำไลหินตามเดือนเกิด และพลังหินที่เหมาะกับคุณ',
    images: [
      {
        url: '/images/banner/personalized-banner.avif',
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
