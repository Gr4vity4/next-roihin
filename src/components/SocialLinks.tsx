import { cn } from '@/lib/utils'
import Image from 'next/image'

export interface SocialLink {
  platform: 'facebook' | 'instagram' | 'twitter' | 'line' | 'youtube' | 'tiktok' | 'pinterest' | 'whatsapp'
  href: string
  label?: string
}

interface SocialLinksProps {
  links: SocialLink[]
  size?: 'sm' | 'md' | 'lg'
  gap?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'w-5 h-5',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
}

const gapClasses = {
  sm: 'space-x-2',
  md: 'space-x-4',
  lg: 'space-x-6',
}

const getSocialIcon = (platform: SocialLink['platform'], size: 'sm' | 'md' | 'lg') => {
  const sizeMap = {
    sm: 20,
    md: 24,
    lg: 32,
  }
  
  const iconSize = sizeMap[size]
  
  return (
    <Image
      src={`/images/social/${platform}.png`}
      alt={`${platform} icon`}
      width={iconSize}
      height={iconSize}
      className="object-contain"
    />
  )
}

export default function SocialLinks({
  links,
  size = 'md',
  gap = 'md',
  className = '',
}: SocialLinksProps) {
  return (
    <div className={cn('flex items-center', gapClasses[gap], className)}>
      {links.map((link) => (
        <a
          key={link.platform}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'hover:opacity-80 transition-opacity flex items-center justify-center',
            sizeClasses[size]
          )}
          aria-label={link.label || `Visit us on ${link.platform}`}
        >
          {getSocialIcon(link.platform, size)}
        </a>
      ))}
    </div>
  )
}