import { HTMLAttributes, ReactNode, createElement } from 'react'
import { cn } from '@/lib/utils'

interface TypographyProps extends HTMLAttributes<HTMLElement> {
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption'
  component?: React.ElementType
  children: ReactNode
  className?: string
  textShadow?: boolean
  color?: 'primary' | 'highlight' | string
  align?: 'left' | 'center' | 'right' | 'justify'
}

const variantStyles = {
  h1: 'text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold tracking-wider',
  h2: 'text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-wider',
  h3: 'text-2xl sm:text-3xl md:text-4xl font-bold',
  h4: 'text-xl sm:text-2xl md:text-3xl font-semibold',
  body: 'text-base sm:text-lg leading-relaxed',
  caption: 'text-sm text-gray-600',
}

const variantComponents = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  body: 'p',
  caption: 'span',
}


const alignmentClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
}

const colorClasses = {
  primary: 'text-[#006039]', // Direct hex value for green
  highlight: 'text-[#D4AF37]', // Direct hex value for gold
} as const

export default function Typography({
  variant,
  component,
  children,
  className = '',
  textShadow = false,
  color,
  align,
  ...props
}: TypographyProps) {
  const Component = component || variantComponents[variant]
  
  // Handle color: use predefined colors if they match, otherwise treat as Tailwind class
  const getColorClass = (color?: string) => {
    if (!color) return undefined
    if (color in colorClasses) {
      return colorClasses[color as keyof typeof colorClasses]
    }
    return color
  }
  
  const colorClass = getColorClass(color)
  
  return createElement(
    Component,
    {
      className: cn(
        variantStyles[variant],
        'font-mixed-lang', // Always apply mixed-lang as default
        textShadow && 'text-shadow',
        align && alignmentClasses[align],
        colorClass,
        className
      ),
      ...props
    },
    children
  )
}