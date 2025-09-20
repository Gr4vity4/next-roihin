import { Link } from '@/i18n/navigation'
import { Typography } from '.'

// Simple SVG icon component
function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m9 18 6-6-6-6" />
    </svg>
  )
}

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav className={`flex items-center text-sm ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRightIcon className="h-4 w-4 text-gray-400 mx-2" />
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="text-gray-600 hover:text-[#006039] transition-colors duration-200"
              >
                <Typography
                  variant="caption"
                 
                  className="text-sm hover:text-[#006039]"
                >
                  {item.label}
                </Typography>
              </Link>
            ) : (
              <Typography
                variant="caption"
               
                className="text-sm text-gray-900"
              >
                {item.label}
              </Typography>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}