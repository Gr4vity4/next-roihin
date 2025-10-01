/**
 * Error handling utilities for consistent error messages across the application
 */

/**
 * Extract a user-friendly error message from unknown error types
 * @param error - The error object (unknown type from catch blocks)
 * @param fallbackMessage - Default message if error cannot be extracted
 * @returns A user-friendly error message string
 */
export function getErrorMessage(error: unknown, fallbackMessage: string): string {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }

  return fallbackMessage
}

/**
 * Create a standardized error response object
 * @param error - The error object
 * @param defaultMessage - Default message for non-Error objects
 * @returns Standardized error object with message property
 */
export function createErrorResponse(error: unknown, defaultMessage: string) {
  return {
    error: getErrorMessage(error, defaultMessage)
  }
}

/**
 * Log error with optional context
 * @param context - Context string for the error (e.g., 'WishlistContext', 'API Route')
 * @param error - The error to log
 * @param additionalInfo - Optional additional information
 */
export function logError(context: string, error: unknown, additionalInfo?: Record<string, unknown>) {
  console.error(`[${context}]`, error, additionalInfo ? additionalInfo : '')
}
