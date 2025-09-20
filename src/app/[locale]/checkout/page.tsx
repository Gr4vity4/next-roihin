import { Metadata } from 'next'
import NavigationWithSuspense from '@/components/NavigationWithSuspense'
import ChatWidget from '@/components/ChatWidget'
import { Footer } from '@/components/sections'
import CheckoutContent from '@/components/sections/CheckoutContent'
import { getTranslations } from 'next-intl/server'

interface CheckoutPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: CheckoutPageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'checkout' })

  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
  }
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