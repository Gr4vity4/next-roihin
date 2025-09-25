import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import { TranslationProvider } from '@/contexts/TranslationContext'
import { WishlistProvider } from '@/contexts/WishlistContext'
import { routing } from '@/i18n/routing'
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { Inter, Playfair_Display, Prompt } from 'next/font/google'
import { notFound } from 'next/navigation'
import '../globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const prompt = Prompt({
  subsets: ['thai', 'latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-prompt',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ROIHIN STONE & BRACELET - Personalized Stone Bracelet',
  description: 'Transform your life on a spiritual level with personalized stone stringing science',
  icons: {
    icon: [
      {
        url: '/images/icons/roihin-32x32.avif',
        sizes: '32x32',
        type: 'image/avif',
      },
      {
        url: '/images/icons/roihin-192x192.avif',
        sizes: '192x192',
        type: 'image/avif',
      },
    ],
    shortcut: {
      url: '/images/icons/roihin-32x32.avif',
      type: 'image/avif',
    },
    apple: {
      url: '/images/icons/roihin-180x180.avif',
      sizes: '180x180',
      type: 'image/avif',
    },
  },
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params

  // Ensure that the incoming locale is valid
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound()
  }

  // Enable static rendering
  setRequestLocale(locale)

  // Get messages for the current locale
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body
        className={`${inter.variable} ${playfairDisplay.variable} ${prompt.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <TranslationProvider>
            <AuthProvider>
              <CartProvider>
                <WishlistProvider>{children}</WishlistProvider>
              </CartProvider>
            </AuthProvider>
          </TranslationProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
