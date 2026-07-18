'use client'

import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { MapPin } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import FooterColumn, { type FooterLink } from '../FooterColumn'
import SocialLinks, { type SocialLink } from '../SocialLinks'
import { Container, Typography } from '../ui'

interface FooterColumnData {
  title: string
  links: FooterLink[]
}

interface FooterProps {
  backgroundColor?: string
  textColor?: string
  className?: string
}

export default function Footer({
  backgroundColor = 'bg-black',
  textColor = 'text-white',
  className = '',
}: FooterProps) {
  const locale = useLocale()
  const isThai = locale === 'th'
  const t = useTranslations('navigation')

  // Use same navigation items as navbar
  const columns: FooterColumnData[] = [
    {
      title: t('about'),
      links: [
        { text: t('about'), href: '/about' },
        { text: t('personalized'), href: '/personalized' },
        { text: t('charmspacer'), href: '/charmspacer' },
        { text: t('diy'), href: '/custom' },
      ],
    },
    {
      title: t('customerService'),
      links: [
        { text: t('testimonial'), href: '/testimonial' },
        { text: t('customerService'), href: '/customer-service' },
        { text: t('blog'), href: '/blog' },
      ],
    },
  ]

  const contactInfo = {
    address: isThai
      ? '101/54 หมู่บ้าน ภัสสร 70 (เกาะแก้ว) หมู่ที่ 4 ตำบลเกาะแก้ว อ.เมืองภูเก็ต จ.ภูเก็ต 83000'
      : '101/54 Passorn 70 Village (Ko Kaew), Village No. 4, Ko Kaew, Mueang Phuket, Phuket 83000',
    socialLinks: [
      { platform: 'facebook' as const, href: 'https://www.facebook.com/roihin42896395' },
      { platform: 'instagram' as const, href: 'https://www.instagram.com/roihinth/' },
      { platform: 'youtube' as const, href: 'https://www.youtube.com/@roihinTH' },
      { platform: 'tiktok' as const, href: 'https://www.tiktok.com/@ceo_roihin' },
      { platform: 'pinterest' as const, href: 'https://www.pinterest.com/Roihin_th/' },
      { platform: 'line' as const, href: 'https://lin.ee/r94Dnio' },
      { platform: 'whatsapp' as const, href: 'tel:+66838265195' },
    ] as SocialLink[],
  }

  const copyright = isThai
    ? '© 2021 สงวนลิขสิทธิ์โดย Roihin Stone and Bracelet'
    : '© 2021 All rights reserved by Roihin Stone and Bracelet'
  return (
    <>
      <footer
        className={cn(
          'py-8 sm:py-10 md:py-12 border-t border-gray-800',
          backgroundColor,
          textColor,
          className,
        )}
      >
        <Container padding="lg">
          <div className="grid md:grid-cols-4 gap-6 sm:gap-7 md:gap-8 mb-6 sm:mb-7 md:mb-8">
            {/* Logo Column */}
            <div className="flex justify-center md:justify-start">
              <Link href="/" className="inline-block">
                <div className="relative w-24 h-24 md:w-32 md:h-32">
                  <Image
                    src="/images/logo.avif"
                    alt="Roihin Logo"
                    fill
                    className="object-contain"
                  />
                </div>
              </Link>
            </div>

            {/* Footer Columns */}
            {columns.map((column, index) => (
              <FooterColumn key={index} title={column.title} links={column.links} />
            ))}

            {/* Contact Info Column */}
            <div className="space-y-4">
              <p className="">{t('customerService')}</p>
              <div className="space-y-2 text-gray-400 text-sm">
                <div className="flex items-start space-x-2">
                  <MapPin size={16} className="mt-1 flex-shrink-0" />
                  <span className=" break-words font-prompt">{contactInfo.address}</span>
                </div>
                <div className="pt-4">
                  <SocialLinks links={contactInfo.socialLinks} size="md" gap="sm" />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 sm:pt-7 md:pt-8 text-center text-gray-400">
            <Typography variant="body" className="!text-sm font-prompt">
              {copyright}
            </Typography>
          </div>
        </Container>
      </footer>
    </>
  )
}
