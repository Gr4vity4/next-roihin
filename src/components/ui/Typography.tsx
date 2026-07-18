'use client'

import { cn } from '@/lib/utils'
import { containsNumbers } from '@/lib/utils/text'
import { Children, HTMLAttributes, ReactNode, cloneElement, createElement, isValidElement } from 'react'
import { useLocale } from 'next-intl'
import { useFontContext } from '@/components/providers/FontProvider'

interface TypographyProps extends HTMLAttributes<HTMLElement> {
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption'
  component?: React.ElementType
  children: ReactNode
  className?: string
  textShadow?: boolean
  color?: 'primary' | 'highlight' | string
  align?: 'left' | 'center' | 'right' | 'justify'
  fontOverride?: string // Allow manual font override
}

const variantStyles = {
  h1: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-wider',
  h2: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-wider',
  h3: 'text-xl sm:text-2xl md:text-3xl font-bold',
  h4: 'text-lg sm:text-xl md:text-2xl font-semibold',
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
  primary: 'text-[#244323]', // Direct hex value for green
  highlight: 'text-[#cb9e51]', // Direct hex value for gold
} as const

const AMPERSAND_CHAR = '&'

const wrapAmpersandsWithBodoniFont = (node: ReactNode): ReactNode => {
  if (typeof node === 'string') {
    if (!node.includes(AMPERSAND_CHAR)) return node

    const parts = node.split(AMPERSAND_CHAR)
    return parts.flatMap((part, index) => [
      part,
      index < parts.length - 1
        ? createElement(
            'span',
            { key: `ampersand-${index}`, className: 'font-bodoni' },
            AMPERSAND_CHAR,
          )
        : null,
    ])
  }

  if (Array.isArray(node)) {
    // Children.map auto-assigns keys, which a plain node.map() would not
    return Children.map(node, (child) => wrapAmpersandsWithBodoniFont(child))
  }

  if (isValidElement(node)) {
    const elementChildren = (node.props as { children?: ReactNode }).children
    if (!elementChildren) return node
    return cloneElement(node, undefined, wrapAmpersandsWithBodoniFont(elementChildren))
  }

  return node
}

export default function Typography({
  variant,
  component,
  children,
  className = '',
  textShadow = false,
  color,
  align,
  fontOverride,
  ...props
}: TypographyProps) {
  const Component = component || variantComponents[variant]
  const fontContext = useFontContext()
  const locale = useLocale()

  // Handle color: use predefined colors if they match, otherwise treat as Tailwind class
  const getColorClass = (color?: string) => {
    if (!color) return undefined
    if (color in colorClasses) {
      return colorClasses[color as keyof typeof colorClasses]
    }
    return color
  }

  const colorClass = getColorClass(color)

  // Helper function to recursively check if children contain numbers
  const checkChildrenForNumbers = (node: ReactNode): boolean => {
    if (typeof node === 'string') {
      return containsNumbers(node)
    }
    if (typeof node === 'number') {
      return true
    }
    if (Array.isArray(node)) {
      return node.some((child) => checkChildrenForNumbers(child))
    }
    if (isValidElement(node)) {
      const props = node.props as { children?: ReactNode }
      if (props.children) {
        return checkChildrenForNumbers(props.children)
      }
    }
    return false
  }

  // Determine font class to use
  const getFontClass = () => {
    // 1. If fontOverride is provided, use it
    if (fontOverride) {
      return fontOverride
    }

    // 2. If within FontProvider context, use context font
    if (fontContext?.fontClass) {
      return fontContext.fontClass
    }

    // 3. Otherwise, use default logic. The digit check only applies to Thai —
    //    English text must always use the mixed stack (Bodoni Moda for Latin),
    //    even when it contains numbers (e.g. phone numbers, LINE IDs)
    if (locale === 'th' && checkChildrenForNumbers(children)) {
      return 'font-prompt'
    }
    return 'font-mixed-lang'
  }

  return createElement(
    Component,
    {
      className: cn(
        variantStyles[variant],
        getFontClass(),
        textShadow && 'text-shadow',
        align && alignmentClasses[align],
        colorClass,
        className,
      ),
      ...props,
    },
    wrapAmpersandsWithBodoniFont(children),
  )
}
