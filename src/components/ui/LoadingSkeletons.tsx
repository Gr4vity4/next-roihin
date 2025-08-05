import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

// Base skeleton component
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("animate-pulse bg-gray-200 rounded", className)} />
  )
}

// Card skeleton for product cards, testimonials, etc.
export function CardSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("bg-white border border-gray-200 p-6 shadow-sm animate-pulse", className)}>
      <div className="w-full h-48 bg-gray-200 rounded-lg mb-4" />
      <div className="space-y-3">
        <div className="w-3/4 h-5 bg-gray-200 rounded" />
        <div className="space-y-2">
          <div className="w-full h-4 bg-gray-200 rounded" />
          <div className="w-full h-4 bg-gray-200 rounded" />
          <div className="w-2/3 h-4 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  )
}

// Article/Blog post skeleton
export function ArticleSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("animate-pulse", className)}>
      <div className="w-full h-48 bg-gray-200 rounded-lg mb-4" />
      <div className="space-y-3">
        <div className="w-20 h-6 bg-gray-200 rounded-full" />
        <div className="space-y-2">
          <div className="w-full h-6 bg-gray-200 rounded" />
          <div className="w-3/4 h-6 bg-gray-200 rounded" />
        </div>
        <div className="space-y-2">
          <div className="w-full h-4 bg-gray-200 rounded" />
          <div className="w-full h-4 bg-gray-200 rounded" />
          <div className="w-2/3 h-4 bg-gray-200 rounded" />
        </div>
        <div className="flex items-center space-x-4 pt-4">
          <div className="w-16 h-4 bg-gray-200 rounded" />
          <div className="w-1 h-1 bg-gray-200 rounded-full" />
          <div className="w-20 h-4 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  )
}

// Gallery item skeleton
export function GalleryItemSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("animate-pulse", className)}>
      <div className="w-full aspect-square bg-gray-200 rounded-lg mb-3" />
      <div className="space-y-2">
        <div className="w-3/4 h-4 bg-gray-200 rounded" />
        <div className="w-1/2 h-3 bg-gray-200 rounded" />
      </div>
    </div>
  )
}

// Testimonial skeleton
export function TestimonialSkeleton({ className, variant = 'light' }: SkeletonProps & { variant?: 'light' | 'dark' }) {
  const bgColor = variant === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
  
  return (
    <div className={cn(`${variant === 'dark' ? 'bg-white/5' : 'bg-white'} backdrop-blur-sm rounded-lg p-6 animate-pulse`, className)}>
      <div className="flex gap-6 items-start">
        <div className="flex-shrink-0">
          <div className={`w-16 h-16 rounded-full ${bgColor}`} />
        </div>
        <div className="flex-1 space-y-3">
          <div className={`w-24 h-3 ${bgColor} rounded`} />
          <div className="space-y-2">
            <div className={`w-full h-4 ${bgColor} rounded`} />
            <div className={`w-5/6 h-4 ${bgColor} rounded`} />
            <div className={`w-4/6 h-4 ${bgColor} rounded`} />
          </div>
        </div>
      </div>
    </div>
  )
}

// Hero section skeleton
export function HeroSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("relative w-full h-[600px] lg:h-[700px] bg-gray-200 animate-pulse", className)}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-4xl mx-auto px-4">
          <div className="w-80 h-14 bg-gray-300 rounded mx-auto" />
          <div className="w-96 h-6 bg-gray-300 rounded mx-auto" />
          <div className="w-44 h-12 bg-gray-300 rounded mx-auto" />
        </div>
      </div>
    </div>
  )
}

// Form skeleton
export function FormSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("bg-white p-8 shadow-sm animate-pulse", className)}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="w-16 h-4 bg-gray-200 rounded mb-2" />
            <div className="w-full h-10 bg-gray-200 rounded" />
          </div>
          <div>
            <div className="w-12 h-4 bg-gray-200 rounded mb-2" />
            <div className="w-full h-10 bg-gray-200 rounded" />
          </div>
        </div>
        
        <div>
          <div className="w-20 h-4 bg-gray-200 rounded mb-2" />
          <div className="w-full h-10 bg-gray-200 rounded" />
        </div>
        
        <div>
          <div className="w-16 h-4 bg-gray-200 rounded mb-2" />
          <div className="w-full h-32 bg-gray-200 rounded" />
        </div>
        
        <div className="text-center">
          <div className="w-32 h-12 bg-gray-200 rounded mx-auto" />
        </div>
      </div>
    </div>
  )
}

// Grid skeleton (for gallery grids, product grids, etc.)
interface GridSkeletonProps extends SkeletonProps {
  items?: number
  columns?: 1 | 2 | 3 | 4
  ItemComponent?: React.ComponentType<SkeletonProps>
}

export function GridSkeleton({ 
  className, 
  items = 8, 
  columns = 3, 
  ItemComponent = CardSkeleton 
}: GridSkeletonProps) {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }

  return (
    <div className={cn(`grid gap-6 ${gridClasses[columns]}`, className)}>
      {Array.from({ length: items }).map((_, index) => (
        <ItemComponent key={index} />
      ))}
    </div>
  )
}

// Navigation skeleton
export function NavigationSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("fixed top-0 left-0 right-0 z-50 bg-white shadow-sm animate-pulse", className)}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="w-32 h-8 bg-gray-200 rounded" />
          <div className="hidden md:flex space-x-8">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="w-16 h-4 bg-gray-200 rounded" />
            ))}
          </div>
          <div className="w-8 h-8 bg-gray-200 rounded md:hidden" />
        </div>
      </div>
    </div>
  )
}