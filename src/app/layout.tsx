import { fcIconic } from '@/fonts/fciconic'
import type { Metadata } from 'next'
import { Inter, Noto_Sans_Thai, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const notoSansThai = Noto_Sans_Thai({
  subsets: ['thai'],
  variable: '--font-noto-thai',
  weight: ['300', '400', '500', '600', '700'],
})

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700', '800', '900'],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${notoSansThai.variable} ${fcIconic.variable} ${playfairDisplay.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
