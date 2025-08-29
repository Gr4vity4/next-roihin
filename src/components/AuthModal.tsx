'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import Button from '@/components/Button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import ForgotPasswordModal from '@/components/ForgotPasswordModal'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'sign-in' | 'sign-up'
  onModeChange: (mode: 'sign-in' | 'sign-up') => void
}

export default function AuthModal({ isOpen, onClose, mode, onModeChange }: AuthModalProps) {
  const router = useRouter()
  const { login, register } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  })
  const [signUpData, setSignUpData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
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
      setError(err instanceof Error ? err.message : 'เข้าสู่ระบบไม่สำเร็จ')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    if (signUpData.password !== signUpData.confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน')
      setIsLoading(false)
      return
    }
    
    if (!signUpData.acceptTerms) {
      setError('กรุณายอมรับข้อกำหนดการใช้งาน')
      setIsLoading(false)
      return
    }
    
    try {
      await register({
        firstName: signUpData.firstName,
        lastName: signUpData.lastName,
        email: signUpData.email,
        phone: signUpData.phone,
        password: signUpData.password,
        acceptTerms: signUpData.acceptTerms
      })
      onClose()
      router.push('/member')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'สมัครสมาชิกไม่สำเร็จ')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">ยินดีต้อนรับกลับ</h1>
              <p className="text-gray-600">เข้าสู่ระบบเพื่อเข้าถึงบัญชีของคุณ</p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">อีเมล</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="กรอกอีเมลของคุณ"
                  value={signInData.email}
                  onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">รหัสผ่าน</Label>
                  <button 
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-[#005635] hover:underline"
                  >
                    ลืมรหัสผ่าน?
                  </button>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="กรอกรหัสผ่านของคุณ"
                  value={signInData.password}
                  onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                  required
                  className="w-full"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-[#005635] focus:ring-[#005635] border-gray-300 rounded"
                />
                <Label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                  จดจำฉัน
                </Label>
              </div>

              <Button
                type="submit"
                fullWidth
                size="lg"
                isLoading={isLoading}
              >
                เข้าสู่ระบบ
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                ยังไม่มีบัญชี?{' '}
                <button 
                  onClick={() => onModeChange('sign-up')}
                  className="font-semibold text-[#005635] hover:underline"
                >
                  สมัครสมาชิก
                </button>
              </p>
            </div>

          </div>
        ) : (
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">สร้างบัญชี</h1>
              <p className="text-gray-600">เข้าร่วมกับเราเพื่อเริ่มต้นการปรับแต่งกำไลของคุณ</p>
            </div>

            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">ชื่อ</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="สมชาย"
                    value={signUpData.firstName}
                    onChange={(e) => setSignUpData({ ...signUpData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">นามสกุล</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="ใจดี"
                    value={signUpData.lastName}
                    onChange={(e) => setSignUpData({ ...signUpData, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">อีเมล</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="somchai@example.com"
                  value={signUpData.email}
                  onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="081 234 5678"
                  value={signUpData.phone}
                  onChange={(e) => setSignUpData({ ...signUpData, phone: e.target.value })}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">รหัสผ่าน</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="สร้างรหัสผ่าน"
                  value={signUpData.password}
                  onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="ยืนยันรหัสผ่านของคุณ"
                  value={signUpData.confirmPassword}
                  onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
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
                  className="h-4 w-4 text-[#005635] focus:ring-[#005635] border-gray-300 rounded mt-0.5"
                />
                <Label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                  ฉันยอมรับ{' '}
                  <a href="/terms" className="text-[#005635] hover:underline">
                    ข้อกำหนดการใช้งาน
                  </a>{' '}
                  และ{' '}
                  <a href="/privacy" className="text-[#005635] hover:underline">
                    นโยบายความเป็นส่วนตัว
                  </a>
                </Label>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                fullWidth
                size="lg"
                isLoading={isLoading}
              >
                สร้างบัญชี
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                มีบัญชีแล้ว?{' '}
                <button 
                  onClick={() => onModeChange('sign-in')}
                  className="font-semibold text-[#005635] hover:underline"
                >
                  เข้าสู่ระบบ
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