import { Metadata } from 'next'
import { Suspense } from 'react'
import NavigationWithSuspense from '@/components/NavigationWithSuspense'
import ChatWidget from '@/components/ChatWidget'
import { Footer } from '@/components/sections'
import ThankYouContent from '@/components/sections/ThankYouContent'
import { getTranslations } from 'next-intl/server'

interface ThankYouPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: ThankYouPageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'thankYou' })

  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
  }
}

function ThankYouLoading() {
  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading order details...</p>
      </div>
    </div>
  )
}

export default function ThankYouPage() {
  return (
    <>
      <NavigationWithSuspense position="static" />
      
      <main className="min-h-screen bg-black">
        <Suspense fallback={<ThankYouLoading />}>
          <ThankYouContent />
        </Suspense>
      </main>

      <Footer />
      <ChatWidget />
    </>
  )
}