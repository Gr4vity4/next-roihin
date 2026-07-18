'use client'

import Button from '@/components/Button'
import ForgotPasswordModal from '@/components/ForgotPasswordModal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import PhoneInput from '@/components/ui/PhoneInput'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { combinePhone } from '@/lib/data/countries'
import { X } from 'lucide-react'
import { useRouter } from '@/i18n/navigation'
import { Link } from '@/i18n/navigation'
import { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'sign-in' | 'sign-up'
  onModeChange: (mode: 'sign-in' | 'sign-up') => void
}

export default function AuthModal({ isOpen, onClose, mode, onModeChange }: AuthModalProps) {
  const router = useRouter()
  const { login, register } = useAuth()
  const { itemCount } = useCart()
  const t = useTranslations('auth')
  const locale = useLocale()
  const [isLoading, setIsLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
  })
  const [signUpData, setSignUpData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneCountry: 'th',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  })

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await login(signInData.email, signInData.password)
      onClose()
      router.push('/member')
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.loginFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (signUpData.password !== signUpData.confirmPassword) {
      setError(t('errors.passwordMismatch'))
      setIsLoading(false)
      return
    }

    if (!signUpData.acceptTerms) {
      setError(t('errors.acceptTermsRequired'))
      setIsLoading(false)
      return
    }

    try {
      await register({
        firstName: signUpData.firstName,
        lastName: signUpData.lastName,
        email: signUpData.email,
        phone: combinePhone(signUpData.phoneCountry, signUpData.phone),
        password: signUpData.password,
        acceptTerms: signUpData.acceptTerms,
      })
      onClose()
      router.push(itemCount > 0 ? '/checkout' : '/shop')
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.signUpFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {mode === 'sign-in' ? (
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('signIn.title')}</h1>
              <p className="text-gray-600">{t('signIn.subtitle')}</p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">{t('signIn.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('signIn.emailPlaceholder')}
                  value={signInData.email}
                  onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">{t('signIn.password')}</Label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-[#244323] hover:underline"
                  >
                    {t('signIn.forgotPassword')}
                  </button>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder={t('signIn.passwordPlaceholder')}
                  value={signInData.password}
                  onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                  required
                  className="w-full"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600" dangerouslySetInnerHTML={{ __html: error }} />
                </div>
              )}

              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-[#244323] focus:ring-[#244323] border-gray-300 rounded"
                />
                <Label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                  {t('signIn.rememberMe')}
                </Label>
              </div>

              <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
                {t('signIn.signInButton')}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                {t('signIn.noAccount')}{' '}
                <button
                  onClick={() => onModeChange('sign-up')}
                  className="font-semibold text-[#244323] hover:underline"
                >
                  {t('signIn.signUpLink')}
                </button>
              </p>
            </div>
          </div>
        ) : (
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('signUp.title')}</h1>
              <p className="text-gray-600">{t('signUp.subtitle')}</p>
            </div>

            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t('signUp.firstName')}</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder={t('signUp.firstNamePlaceholder')}
                    value={signUpData.firstName}
                    onChange={(e) => setSignUpData({ ...signUpData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t('signUp.lastName')}</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder={t('signUp.lastNamePlaceholder')}
                    value={signUpData.lastName}
                    onChange={(e) => setSignUpData({ ...signUpData, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t('signUp.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('signUp.emailPlaceholder')}
                  value={signUpData.email}
                  onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t('signUp.phone')}</Label>
                <PhoneInput
                  id="phone"
                  lang={locale}
                  country={signUpData.phoneCountry}
                  phone={signUpData.phone}
                  onCountryChange={(code) => setSignUpData({ ...signUpData, phoneCountry: code })}
                  onPhoneChange={(phone) => setSignUpData({ ...signUpData, phone })}
                  placeholder={t('signUp.phonePlaceholder')}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('signUp.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t('signUp.passwordPlaceholder')}
                  value={signUpData.password}
                  onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('signUp.confirmPassword')}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder={t('signUp.confirmPasswordPlaceholder')}
                  value={signUpData.confirmPassword}
                  onChange={(e) =>
                    setSignUpData({ ...signUpData, confirmPassword: e.target.value })
                  }
                  required
                  className="w-full"
                />
              </div>

              <div className="flex items-start">
                <input
                  id="terms"
                  type="checkbox"
                  checked={signUpData.acceptTerms}
                  onChange={(e) => setSignUpData({ ...signUpData, acceptTerms: e.target.checked })}
                  required
                  className="h-4 w-4 text-[#244323] focus:ring-[#244323] border-gray-300 rounded mt-0.5"
                />
                <Label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                  {t('signUp.acceptTerms')}{' '}
                  <Link href="/terms" className="text-[#244323] hover:underline">
                    {t('signUp.termsOfService')}
                  </Link>{' '}
                  {t('signUp.and')}{' '}
                  <Link href="/privacy" className="text-[#244323] hover:underline">
                    {t('signUp.privacyPolicy')}
                  </Link>
                </Label>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600" dangerouslySetInnerHTML={{ __html: error }} />
                </div>
              )}

              <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
                {t('signUp.signUpButton')}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {t('signUp.haveAccount')}{' '}
                <button
                  onClick={() => onModeChange('sign-in')}
                  className="font-semibold text-[#244323] hover:underline"
                >
                  {t('signUp.signInLink')}
                </button>
              </p>
            </div>
          </div>
        )}
      </div>

      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        onBackToSignIn={() => setShowForgotPassword(false)}
      />
    </div>
  )
}
