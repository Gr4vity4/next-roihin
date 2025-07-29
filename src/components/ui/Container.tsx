import { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  center?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const maxWidthClasses = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'w-full',
}

const paddingClasses = {
  none: '',
  sm: 'px-4',
  md: 'px-4 md:px-8',
  lg: 'px-4 md:px-8 lg:px-12',
}

export default function Container({
  children,
  className = '',
  maxWidth = 'lg',
  center = true,
  padding = 'md',
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        'container',
        maxWidthClasses[maxWidth],
        center && 'mx-auto',
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}