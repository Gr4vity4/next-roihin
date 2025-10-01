import ChatWidget from '@/components/ChatWidget'
import NavigationWithSuspense from '@/components/NavigationWithSuspense'
import { Footer } from '@/components/sections'
import CheckoutConfirmContent from '@/components/sections/CheckoutConfirmContent'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

interface CheckoutConfirmPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: CheckoutConfirmPageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'checkoutConfirm' })

  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
  }
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
