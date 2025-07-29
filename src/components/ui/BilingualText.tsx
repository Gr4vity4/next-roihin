import Typography from './Typography'
import { cn } from '@/lib/utils'

interface BilingualTextProps {
  thai?: string
  english?: string
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption'
  thaiClassName?: string
  englishClassName?: string
  gap?: 'sm' | 'md' | 'lg'
  layout?: 'vertical' | 'horizontal'
}

const gapClasses = {
  sm: 'space-y-2',
  md: 'space-y-4',
  lg: 'space-y-8',
}

const horizontalGapClasses = {
  sm: 'space-x-2',
  md: 'space-x-4',
  lg: 'space-x-8',
}

export default function BilingualText({
  thai,
  english,
  variant = 'body',
  thaiClassName = '',
  englishClassName = '',
  gap = 'md',
  layout = 'vertical',
}: BilingualTextProps) {
  if (!thai && !english) return null
  
  const containerClass = layout === 'vertical' 
    ? gapClasses[gap] 
    : cn('flex', horizontalGapClasses[gap])
  
  return (
    <div className={containerClass}>
      {thai && (
        <Typography
          variant={variant}
          fontFamily="thai"
          className={thaiClassName}
        >
          {thai}
        </Typography>
      )}
      {english && (
        <Typography
          variant={variant}
          className={englishClassName}
        >
          {english}
        </Typography>
      )}
    </div>
  )
}