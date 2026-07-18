'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from '@/i18n/navigation'
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import Button from '@/components/Button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link } from '@/i18n/navigation'
import { useLocale } from 'next-intl'

function ResetPasswordForm() {
  const locale = useLocale()
  const isThai = locale === 'th'
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const email = searchParams.get('email')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState<{
    password?: string
    confirmPassword?: string
  }>({})

  useEffect(() => {
    // Redirect if no token or email
    if (!token || !email) {
      router.push('/')
    }
  }, [token, email, router])

  const validatePassword = (value: string) => {
    if (value.length < 8) {
      return isThai
        ? 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร'
        : 'Password must be at least 8 characters'
    }
    if (!/[A-Z]/.test(value)) {
      return isThai
        ? 'รหัสผ่านต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว'
        : 'Password must include at least one uppercase letter'
    }
    if (!/[a-z]/.test(value)) {
      return isThai
        ? 'รหัสผ่านต้องมีตัวพิมพ์เล็กอย่างน้อย 1 ตัว'
        : 'Password must include at least one lowercase letter'
    }
    if (!/[0-9]/.test(value)) {
      return isThai
        ? 'รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว'
        : 'Password must include at least one number'
    }
    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate
    const newErrors: typeof errors = {}
    
    const passwordError = validatePassword(password)
    if (passwordError) {
      newErrors.password = passwordError
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = isThai ? 'รหัสผ่านไม่ตรงกัน' : 'Passwords do not match'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setErrors({})
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email || '',
          token: token || '',
          password,
        }),
      })

      // Laravel returns 204 No Content on success
      if (response.status === 204) {
        setIsSuccess(true)
        // Redirect to home after 3 seconds
        setTimeout(() => {
          router.push('/')
        }, 3000)
        return
      }

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)
        // Redirect to home after 3 seconds
        setTimeout(() => {
          router.push('/')
        }, 3000)
      } else {
        setErrors({
          password:
            data.error || (isThai ? 'ไม่สามารถรีเซ็ตรหัสผ่านได้' : 'Failed to reset password'),
        })
      }
    } catch (error) {
      console.error('Network error:', error)
      setErrors({
        password: isThai
          ? 'เกิดข้อผิดพลาดด้านเครือข่าย กรุณาลองใหม่อีกครั้ง'
          : 'Network error. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isThai ? 'รีเซ็ตรหัสผ่านสำเร็จ!' : 'Password reset successful!'}
            </h1>
            <p className="text-gray-600 mb-6">
              {isThai
                ? 'รหัสผ่านของคุณได้รับการเปลี่ยนแปลงเรียบร้อยแล้ว'
                : 'Your password has been updated successfully.'}
            </p>
            <p className="text-sm text-gray-500">
              {isThai ? 'กำลังเปลี่ยนเส้นทางไปยังหน้าหลัก...' : 'Redirecting to homepage...'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isThai ? 'ตั้งรหัสผ่านใหม่' : 'Set a new password'}
            </h1>
            <p className="text-gray-600">
              {isThai ? 'กรุณากรอกรหัสผ่านใหม่ของคุณ' : 'Please enter your new password'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password">{isThai ? 'รหัสผ่านใหม่' : 'New password'}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={isThai ? 'กรอกรหัสผ่านใหม่' : 'Enter new password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errors.password) {
                      setErrors({ ...errors, password: '' })
                    }
                  }}
                  required
                  className={cn(
                    "w-full pr-10",
                    errors.password && "border-red-500 focus:ring-red-500"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password}</p>
              )}
              <ul className="text-xs text-gray-500 space-y-1 mt-2">
                <li className={password.length >= 8 ? 'text-green-600' : ''}>
                  {isThai ? '• อย่างน้อย 8 ตัวอักษร' : '• At least 8 characters'}
                </li>
                <li className={/[A-Z]/.test(password) ? 'text-green-600' : ''}>
                  {isThai
                    ? '• มีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว'
                    : '• At least one uppercase letter'}
                </li>
                <li className={/[a-z]/.test(password) ? 'text-green-600' : ''}>
                  {isThai
                    ? '• มีตัวพิมพ์เล็กอย่างน้อย 1 ตัว'
                    : '• At least one lowercase letter'}
                </li>
                <li className={/[0-9]/.test(password) ? 'text-green-600' : ''}>
                  {isThai ? '• มีตัวเลขอย่างน้อย 1 ตัว' : '• At least one number'}
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                {isThai ? 'ยืนยันรหัสผ่าน' : 'Confirm password'}
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder={isThai ? 'ยืนยันรหัสผ่านใหม่' : 'Confirm new password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    if (errors.confirmPassword) {
                      setErrors({ ...errors, confirmPassword: '' })
                    }
                  }}
                  required
                  className={cn(
                    "w-full pr-10",
                    errors.confirmPassword && "border-red-500 focus:ring-red-500"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={isLoading}
            >
              {isThai ? 'บันทึกรหัสผ่านใหม่' : 'Save new password'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              href="/"
              className="text-sm text-gray-600 hover:text-[#244323] transition-colors"
            >
              {isThai ? 'กลับไปหน้าหลัก' : 'Back to homepage'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#244323]"></div>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
