import DOMPurify from 'dompurify'

/**
 * Safely sanitizes HTML content to prevent XSS attacks
 * Allows safe HTML tags while removing potentially dangerous content
 */
export function sanitizeHtml(html: string): string {
  // Only run DOMPurify on the client side
  if (typeof window === 'undefined') {
    // On the server side, return the HTML as-is for now
    // In a production environment, you might want to use a server-side sanitizer
    return html
  }

  return DOMPurify.sanitize(html, {
    // Allow common HTML tags that are safe for blog content
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'i', 'b',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'blockquote', 'pre', 'code',
      'a', 'img',
      'div', 'span',
      'table', 'thead', 'tbody', 'tr', 'th', 'td'
    ],
    // Allow safe attributes
    ALLOWED_ATTR: [
      'href', 'title', 'alt', 'src', 'width', 'height',
      'class', 'id', 'target', 'rel'
    ],
    // Remove any script content
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
    // Clean up whitespace
    SANITIZE_DOM: true,
    // Keep content structure
    KEEP_CONTENT: true
  })
}

/**
 * Server-side HTML sanitization using a simple allowlist approach
 * This is a basic fallback for server-side rendering
 */
export function sanitizeHtmlServer(html: string): string {
  // Remove script tags and their content
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  
  // Remove style tags and their content
  sanitized = sanitized.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
  
  // Remove potentially dangerous attributes
  sanitized = sanitized.replace(/\s(on\w+|javascript:)[^>]*/gi, '')
  
  // Remove iframe, object, embed tags
  sanitized = sanitized.replace(/<(iframe|object|embed)\b[^>]*>/gi, '')
  
  return sanitized
}

/**
 * Main sanitization function that works on both client and server
 */
export function sanitizeContent(html: string): string {
  if (typeof window === 'undefined') {
    return sanitizeHtmlServer(html)
  }
  return sanitizeHtml(html)
}