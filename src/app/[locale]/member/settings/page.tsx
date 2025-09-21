'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/Button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTranslations } from 'next-intl'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export default function SettingsPage() {
  const t = useTranslations('member.settings')
  const router = useRouter()
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false)
  const [newPasswordVisible, setNewPasswordVisible] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')
    setIsChangingPassword(true)

    const formData = new FormData(e.currentTarget)
    const currentPassword = formData.get('currentPassword') as string
    const newPassword = formData.get('newPassword') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError(t('changePassword.errors.fieldsRequired'))
      setIsChangingPassword(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(t('changePassword.errors.passwordMismatch'))
      setIsChangingPassword(false)
      return
    }

    try {
      const response = await fetch('/api/account/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setPasswordSuccess(data.message || t('changePassword.success'))
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } else {
        setPasswordError(data.message || t('changePassword.errors.updateFailed'))
      }
    } catch (error) {
      console.error('Password change error:', error)
      setPasswordError(t('changePassword.errors.genericError'))
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleDeleteAccount = () => {
    if (deleteConfirmText === 'DELETE') {
      console.log('Deleting account...')
      setIsDeleteDialogOpen(false)
      setDeleteConfirmText('')
    }
  }

  return (
    <div className="max-w-4xl mx-auto pt-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
        <p className="text-gray-600">{t('subtitle')}</p>
      </div>

      {/* Change Password Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('changePassword.title')}</h2>

        {passwordError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {passwordError}
          </div>
        )}

        {passwordSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg">
            {passwordSuccess}
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">{t('changePassword.currentPassword')}</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                name="currentPassword"
                type={currentPasswordVisible ? 'text' : 'password'}
                placeholder={t('changePassword.currentPasswordPlaceholder')}
                className="pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setCurrentPasswordVisible(!currentPasswordVisible)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {currentPasswordVisible ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">{t('changePassword.newPassword')}</Label>
            <div className="relative">
              <Input
                id="newPassword"
                name="newPassword"
                type={newPasswordVisible ? 'text' : 'password'}
                placeholder={t('changePassword.newPasswordPlaceholder')}
                className="pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setNewPasswordVisible(!newPasswordVisible)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {newPasswordVisible ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t('changePassword.confirmPassword')}</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder={t('changePassword.confirmPasswordPlaceholder')}
              required
            />
          </div>

          <Button type="submit" disabled={isChangingPassword}>
            {isChangingPassword ? t('changePassword.updating') : t('changePassword.updateButton')}
          </Button>
        </form>
      </div>

      {/* Delete Account */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('deleteAccount.title')}</h2>
        <p className="text-gray-600 mb-4">
          {t('deleteAccount.description')}
        </p>
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600">
              {t('deleteAccount.button')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-red-600">{t('deleteAccount.modal.title')}</DialogTitle>
              <DialogDescription className="space-y-3 pt-2">
                <p>
                  {t('deleteAccount.modal.warning')}
                </p>
                <p className="font-medium">
                  {t('deleteAccount.modal.confirmText')}
                </p>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input
                id="confirmDelete"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder={t('deleteAccount.modal.confirmPlaceholder')}
                className="font-mono"
              />
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteDialogOpen(false)
                  setDeleteConfirmText('')
                }}
              >
                {t('deleteAccount.modal.cancel')}
              </Button>
              <Button
                variant="primary"
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== 'DELETE'}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('deleteAccount.modal.permanentDelete')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}