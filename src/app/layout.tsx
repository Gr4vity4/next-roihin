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
