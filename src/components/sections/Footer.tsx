import { cn } from '@/lib/utils'
import { MapPin } from 'lucide-react'
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
  // Hardcoded footer data
  const columns: FooterColumnData[] = [
    {
      title: 'ข้อมูลร้าน',
      links: [
        { text: 'เกี่ยวกับร้อยหิน', href: '#about' },
        { text: 'นโยบายความเป็นส่วนตัว', href: '#privacy' },
      ],
    },
    {
      title: 'บริการลูกค้า',
      links: [
        { text: 'ติดต่อสอบถาม', href: '#contact' },
        { text: 'การจัดส่ง', href: '#shipping' },
        { text: 'การคืนสินค้า', href: '#returns' },
        { text: 'การดูแลรักษา', href: '#care' },
      ],
    },
    {
      title: '',
      links: [],
    },
  ]

  const contactInfo = {
    address: '101/54 หมู่บ้าน ภัสสร 70 (เกาะแก้ว) หมู่ที่ 4 ตำบลเกาะแก้ว อ.เมืองภูเก็ต จ.ภูเก็ต 83000',
    socialLinks: [
      { platform: 'facebook' as const, href: 'https://facebook.com/roihin' },
      { platform: 'instagram' as const, href: 'https://instagram.com/roihin' },
      { platform: 'twitter' as const, href: 'https://twitter.com/roihin' },
    ] as SocialLink[]
  }

  const copyright = '© 2021 All rights is reserved by Roihin Stone and Bracelet'
  return (
    <footer className={cn('py-12', backgroundColor, textColor, className)}>
      <Container>
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {columns.map((column, index) => (
            <FooterColumn key={index} title={column.title} links={column.links} />
          ))}

          <div className="space-y-4">
            <p className="font-iconic">ติดต่อเรา</p>
            <div className="space-y-2 text-gray-400 text-sm">
              <div className="flex items-start space-x-2">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span className="font-thai">{contactInfo.address}</span>
              </div>
              <div className="pt-4">
                <SocialLinks links={contactInfo.socialLinks} size="md" gap="sm" />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <Typography variant="body" className="text-sm">
            {copyright}
          </Typography>
        </div>
      </Container>
    </footer>
  )
}
