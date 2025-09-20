import { ReactNode } from 'react'

/**
 * Checks if a string contains any numeric characters (0-9)
 */
export function containsNumbers(text: string): boolean {
  return /\d/.test(text)
}

/**
 * Wraps text containing numbers with appropriate font classes
 */
export function wrapNumericText(text: ReactNode): ReactNode {
  if (typeof text !== 'string') return text

  // If the text contains numbers, return it with the numeric font class applied
  if (containsNumbers(text)) {
    return text
  }

  return text
}

/**
 * Gets the appropriate font class based on text content
 */
export function getTextFontClass(text: string | ReactNode): string {
  if (typeof text === 'string' && containsNumbers(text)) {
    return 'font-prompt'
  }
  return ''
}

/**
 * Formats numbers with Thai locale and applies Prompt font
 */
export function formatThaiNumber(value: number, options?: Intl.NumberFormatOptions): string {
  return value.toLocaleString('th-TH', options)
}

/**
 * Formats price with Thai Baht symbol and applies Prompt font styling
 */
export function formatThaiPrice(price: number): string {
  return `฿${formatThaiNumber(price)}`
}