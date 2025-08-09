import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format date to Thai Buddhist calendar format
 * Example: "9 ก.ค. 2568"
 */
export function formatThaiDate(dateString: string): string {
  const date = new Date(dateString)
  
  // Thai month abbreviations
  const thaiMonths = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
  ]
  
  const day = date.getDate()
  const month = thaiMonths[date.getMonth()]
  const year = date.getFullYear() + 543 // Convert to Buddhist Era
  
  return `${day} ${month} ${year}`
}

/**
 * Extract text content from HTML string and limit length
 */
export function extractTextFromHtml(html: string, maxLength: number = 128): string {
  // Remove HTML tags
  const textContent = html.replace(/<[^>]*>/g, '')
  
  // Decode HTML entities
  const decoded = textContent
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
  
  // Trim and limit length
  const trimmed = decoded.trim()
  
  if (trimmed.length <= maxLength) {
    return trimmed
  }
  
  return trimmed.substring(0, maxLength).trim() + '...'
}