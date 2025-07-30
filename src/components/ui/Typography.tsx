import { HTMLAttributes, ReactNode, createElement } from 'react'
import { cn } from '@/lib/utils'

interface TypographyProps extends HTMLAttributes<HTMLElement> {
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption'
  component?: React.ElementType
  children: ReactNode
  className?: string
  fontFamily?: 'playfair' | 'thai' | 'default'
  textShadow?: boolean
  color?: string
  align?: 'left' | 'center' | 'right' | 'justify'
}

const variantStyles = {
  h1: 'text-6xl md:text-8xl font-bold tracking-wider',
  h2: 'text-5xl md:text-7xl font-bold tracking-wider',
  h3: 'text-3xl md:text-4xl font-bold',
  h4: 'text-2xl md:text-3xl font-semibold',
  body: 'text-lg leading-relaxed',
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

const fontFamilyClasses = {
  playfair: 'font-playfair',
  thai: 'font-thai',
  default: '',
}

const alignmentClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
}

export default function Typography({
  variant,
  component,
  children,
  className = '',
  fontFamily,
  textShadow = false,
  color,
  align,
  ...props
}: TypographyProps) {
  const Component = component || variantComponents[variant]
  
  return createElement(
    Component,
    {
      className: cn(
        variantStyles[variant],
        fontFamily && fontFamilyClasses[fontFamily],
        textShadow && 'text-shadow',
        align && alignmentClasses[align],
        color,
        className
      ),
      ...props
    },
    children
  )
}