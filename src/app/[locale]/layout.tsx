import type { Metadata } from 'next'
import { Inter, Playfair_Display, Prompt } from 'next/font/google'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import { WishlistProvider } from '@/contexts/WishlistContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { TranslationProvider } from '@/contexts/TranslationContext'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { setRequestLocale, getMessages } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'
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
        url: '/images/icons/357c3a_6b06fbae06e04a6da8cbf1d5fe09440c%7Emv2.jpg',
        sizes: '32x32',
        type: 'image/jpeg',
      },
      {
        url: '/images/icons/357c3a_6b06fbae06e04a6da8cbf1d5fe09440c%7Emv2.jpg',
        sizes: '192x192',
        type: 'image/jpeg',
      },
    ],
    shortcut: {
      url: '/images/icons/357c3a_6b06fbae06e04a6da8cbf1d5fe09440c%7Emv2.jpg',
      type: 'image/jpeg',
    },
    apple: {
      url: '/images/icons/357c3a_6b06fbae06e04a6da8cbf1d5fe09440c%7Emv2.jpg',
      sizes: '180x180',
      type: 'image/jpeg',
    },
  },
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params

  // Ensure that the incoming locale is valid
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  // Enable static rendering
  setRequestLocale(locale)

  // Get messages for the current locale
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body className={`${inter.variable} ${playfairDisplay.variable} ${prompt.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <LanguageProvider>
            <TranslationProvider>
              <AuthProvider>
                <CartProvider>
                  <WishlistProvider>
                    {children}
                  </WishlistProvider>
                </CartProvider>
              </AuthProvider>
            </TranslationProvider>
          </LanguageProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}