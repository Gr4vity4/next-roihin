import { Container, Typography } from '../ui'
import FooterColumn from '../FooterColumn'
import SocialLinks from '../SocialLinks'
import { MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FooterLink {
  text: string
  href: string
}

interface FooterColumnData {
  title: string
  links: FooterLink[]
}

interface SocialLink {
  platform: 'facebook' | 'instagram' | 'twitter' | 'line' | 'youtube'
  href: string
}

interface FooterProps {
  columns: FooterColumnData[]
  contactInfo: {
    address: string
    socialLinks: SocialLink[]
  }
  copyright: string
  backgroundColor?: string
  textColor?: string
  className?: string
}

export default function Footer({
  columns,
  contactInfo,
  copyright,
  backgroundColor = 'bg-black',
  textColor = 'text-white',
  className = '',
}: FooterProps) {
  return (
    <footer className={cn('py-12', backgroundColor, textColor, className)}>
      <Container>
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {columns.map((column, index) => (
            <FooterColumn
              key={index}
              title={column.title}
              links={column.links}
            />
          ))}
          
          <div className="space-y-4">
            <Typography variant="h4" fontFamily="thai" className="font-semibold">
              ติดต่อเรา
            </Typography>
            <div className="space-y-2 text-gray-400 text-sm">
              <div className="flex items-start space-x-2">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span className="font-thai">
                  {contactInfo.address}
                </span>
              </div>
              <div className="pt-4">
                <SocialLinks
                  links={contactInfo.socialLinks}
                  size="md"
                  gap="sm"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <Typography variant="body">
            {copyright}
          </Typography>
        </div>
      </Container>
    </footer>
  )
}