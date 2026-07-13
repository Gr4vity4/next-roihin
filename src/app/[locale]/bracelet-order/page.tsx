import NavigationWithSuspense from '@/components/NavigationWithSuspense'
import { Footer } from '@/components/sections'
import BraceletOrderForm from '@/components/sections/BraceletOrderForm'
import { Metadata } from 'next'

export const revalidate = 0

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isThai = locale === 'th'
  const title = isThai
    ? 'สั่งออกแบบกำไลหินเฉพาะบุคคล - ROIHIN STONE & BRACELET'
    : 'Order Your Personalized Stone Bracelet - ROIHIN STONE & BRACELET'
  const description = isThai
    ? 'ฟอร์มสั่งออกแบบกำไลหินตามเดือนเกิด และพลังหินที่เหมาะกับคุณ'
    : 'Order form for a personalized stone bracelet designed around your birth date and the stone energy that suits you'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
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
