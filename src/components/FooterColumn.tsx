import { cn } from '@/lib/utils'

interface FooterLink {
  text: string
  href: string
}

interface FooterColumnProps {
  title: string
  links: FooterLink[]
  className?: string
}

export default function FooterColumn({ title, links, className = '' }: FooterColumnProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <p className="font-fciconic">{title}</p>
      <ul className="space-y-2 text-gray-400 font-thai text-sm">
        {links.map((link, index) => (
          <li key={index}>
            <a href={link.href} className="hover:text-white transition-colors">
              {link.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
