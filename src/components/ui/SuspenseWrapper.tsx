import { Suspense, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SuspenseWrapperProps {
  fallback: ReactNode
  className?: string
  children: ReactNode
}

/**
 * A wrapper component that provides consistent Suspense boundaries
 */
export function SuspenseWrapper({ 
  fallback, 
  className, 
  children 
}: SuspenseWrapperProps) {
  const content = (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  )

  if (className) {
    return (
      <div className={cn(className)}>
        {content}
      </div>
    )
  }

  return content
}

/**
 * Specialized Suspense wrapper for sections
 */
interface SectionSuspenseProps {
  fallback: ReactNode
  children: ReactNode
  className?: string
  id?: string
}

export function SectionSuspense({ 
  fallback, 
  children, 
  className, 
  id 
}: SectionSuspenseProps) {
  return (
    <section id={id} className={className}>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </section>
  )
}

/**
 * Grid-specific Suspense wrapper
 */
interface GridSuspenseProps {
  fallback: ReactNode
  children: ReactNode
  columns?: 1 | 2 | 3 | 4
  className?: string
}

export function GridSuspense({ 
  fallback, 
  children, 
  columns = 3, 
  className 
}: GridSuspenseProps) {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }

  return (
    <div className={cn(`grid gap-6 ${gridClasses[columns]}`, className)}>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </div>
  )
}