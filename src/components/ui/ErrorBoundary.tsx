'use client'

import { Component, ReactNode, ErrorInfo } from 'react'
import { Typography, Container } from '.'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  className?: string
}

/**
 * Error Boundary component for catching and handling React errors
 * Provides a graceful fallback UI when errors occur
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return (
        <div className={this.props.className || "py-8"}>
          <Container>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg 
                  className="w-8 h-8 text-red-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" 
                  />
                </svg>
              </div>
              
              <Typography variant="h3" className="text-gray-900 mb-2">
                เกิดข้อผิดพลาด / Something went wrong
              </Typography>
              
              <Typography 
                variant="body" 
                
                className="text-gray-600 mb-4"
              >
                ส่วนนี้ไม่สามารถโหลดได้ในขณะนี้ กรุณาลองรีเฟรชหน้าเว็บ
              </Typography>
              
              <Typography variant="body" className="text-gray-500 mb-6">
                This section couldn&apos;t load right now. Please try refreshing the page.
              </Typography>

              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-[#244323] text-white hover:bg-[#004D2E] transition-colors rounded-md"
              >
                รีเฟรช / Refresh
              </button>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 text-left rounded">
                  <Typography variant="caption" className="text-red-700 font-mono text-sm">
                    <strong>Development Error:</strong>
                    <br />
                    {this.state.error.message}
                  </Typography>
                </div>
              )}
            </div>
          </Container>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Function component version of ErrorBoundary for easier usage
 */
interface WithErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  className?: string
}

export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>
) {
  return function WrappedComponent(props: P & WithErrorBoundaryProps) {
    const { fallback, onError, className, ...componentProps } = props
    
    return (
      <ErrorBoundary 
        fallback={fallback} 
        onError={onError} 
        className={className}
      >
        <Component {...(componentProps as P)} />
      </ErrorBoundary>
    )
  }
}

/**
 * Hook-based error boundary for functional components
 */
export function WithErrorBoundary({ 
  children, 
  fallback, 
  onError, 
  className 
}: WithErrorBoundaryProps) {
  return (
    <ErrorBoundary 
      fallback={fallback} 
      onError={onError} 
      className={className}
    >
      {children}
    </ErrorBoundary>
  )
}