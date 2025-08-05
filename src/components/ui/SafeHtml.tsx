'use client'

import { useEffect, useState } from 'react'
import { sanitizeContent } from '@/lib/sanitize'

interface SafeHtmlProps {
  html: string
  className?: string
  as?: keyof React.JSX.IntrinsicElements
}

/**
 * Safely renders HTML content with XSS protection
 * Uses DOMPurify to sanitize HTML before rendering
 */
export function SafeHtml({ html, className, as: Component = 'div' }: SafeHtmlProps) {
  const [sanitizedHtml, setSanitizedHtml] = useState('')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    setSanitizedHtml(sanitizeContent(html))
  }, [html])

  // For SSR, render with server-side sanitization
  if (!isClient) {
    return (
      <Component
        className={className}
        dangerouslySetInnerHTML={{ __html: sanitizeContent(html) }}
      />
    )
  }

  // For client-side, use the sanitized HTML
  return (
    <Component
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  )
}