'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import Button from '@/components/Button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTranslations } from 'next-intl'

interface ForgotPasswordModalProps {
  isOpen: boolean
  onClose: () => void
  onBackToSignIn: () => void
}

export default function ForgotPasswordModal({ isOpen, onClose, onBackToSignIn }: ForgotPasswordModalProps) {
  const t = useTranslations('auth.forgotPassword')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setIsSubmitted(true)
      } else {
        console.error('Error:', data.error)
        // In production, show error message to user
      }
    } catch (error) {
      console.error('Network error:', error)
      // In production, show error message to user
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    onClose()
    // Reset state after modal closes
    setTimeout(() => {
      setEmail('')
      setIsSubmitted(false)
    }, 300)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          {!isSubmitted ? (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
                <p className="text-gray-600">
                  {t('subtitle')}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">{t('email')}</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder={t('emailPlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    id="remember-reset"
                    type="checkbox"
                    className="h-4 w-4 text-[#244323] focus:ring-[#244323] border-gray-300 rounded"
                  />
                  <Label htmlFor="remember-reset" className="ml-2 text-sm text-gray-600">
                    {t('rememberMe')}
                  </Label>
                </div>

                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  isLoading={isLoading}
                >
                  {t('resetButton')}
                </Button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  {t('noAccount')}{' '}
                  <button
                    onClick={onBackToSignIn}
                    className="font-semibold text-[#244323] hover:underline"
                  >
                    {t('signUpLink')}
                  </button>
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  {t('testCredentials')}
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="mb-6">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('successTitle')}</h2>
                <p className="text-gray-600">
                  {t('successMessage')}
                </p>
                <p className="font-semibold text-gray-900 mt-1">{email}</p>
              </div>
              
              <p className="text-sm text-gray-500 mb-6">
                {t('successInstruction')}
              </p>

              <Button
                onClick={onBackToSignIn}
                fullWidth
                size="lg"
              >
                {t('successButton')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}