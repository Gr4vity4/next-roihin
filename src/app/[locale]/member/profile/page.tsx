'use client'

import Button from '@/components/Button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useEffect, useState, useCallback } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import type { ProfileData } from '@/lib/api/profile'

type GenderOption = 'male' | 'female' | 'other' | 'prefer_not_to_say'

export default function ProfilePage() {
  const t = useTranslations('member.profile')
  const locale = useLocale()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [memberSince, setMemberSince] = useState('—')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    gender: 'prefer_not_to_say' as GenderOption,
  })

  const formatMemberSince = useCallback(
    (isoDate?: string | null) => {
      if (!isoDate) {
        return ''
      }

      const date = new Date(isoDate)

      if (Number.isNaN(date.getTime())) {
        return ''
      }

      try {
        return new Intl.DateTimeFormat(locale, {
          month: 'long',
          year: 'numeric',
        }).format(date)
      } catch (error) {
        console.error('Failed to format member since date:', error)
        return ''
      }
    },
    [locale]
  )

  const splitName = useCallback((fullName?: string | null) => {
    if (!fullName) {
      return { firstName: '', lastName: '' }
    }

    const trimmed = fullName.trim()

    if (!trimmed) {
      return { firstName: '', lastName: '' }
    }

    const [first, ...rest] = trimmed.split(/\s+/)

    return {
      firstName: first ?? '',
      lastName: rest.join(' '),
    }
  }, [])

  const normalizeGender = useCallback((value?: ProfileData['gender']): GenderOption => {
    const allowed: GenderOption[] = ['male', 'female', 'other', 'prefer_not_to_say']

    if (!value) {
      return 'prefer_not_to_say'
    }

    return allowed.includes(value as GenderOption) ? (value as GenderOption) : 'prefer_not_to_say'
  }, [])

  const fetchProfile = useCallback(async () => {
    try {
      setIsFetching(true)
      setError(null)

      const response = await fetch('/api/profile')

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch profile')
      }

      const payload = (await response.json()) as ProfileData | { user: ProfileData }
      const profile = 'user' in payload ? payload.user : payload

      if (!profile) {
        throw new Error('Profile response was empty')
      }

      const { firstName, lastName } = splitName(profile.name)
      const phoneValue = profile.shipping_phone || profile.phone || ''

      setFormData((prev) => ({
        ...prev,
        firstName,
        lastName,
        email: profile.email || '',
        phone: phoneValue || '',
        birthDate: profile.birth_date ?? '',
        gender: normalizeGender(profile.gender),
      }))

      const computedMemberSince = formatMemberSince(profile.created_at)
      setMemberSince(computedMemberSince || '—')
    } catch (err) {
      console.error('Failed to fetch profile:', err)
      setError(err instanceof Error ? err.message : t('errors.loadFailed'))
    } finally {
      setIsFetching(false)
    }
  }, [formatMemberSince, normalizeGender, splitName, t])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const fullName = `${formData.firstName} ${formData.lastName}`.replace(/\s+/g, ' ').trim()
    const safeName = fullName.length > 0 ? fullName : formData.email || 'Member'
    const trimmedPhone = formData.phone?.trim() ?? ''
    const normalizedBirthDate = formData.birthDate ? formData.birthDate : null

    const payload = {
      name: safeName,
      shipping_phone: trimmedPhone || null,
      birth_date: normalizedBirthDate,
      gender: formData.gender,
    }

    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || t('errors.updateFailed'))
      }

      const updatedProfile = ('user' in responseData
        ? responseData.user
        : responseData) as ProfileData

      const { firstName, lastName } = splitName(updatedProfile.name)
      const updatedPhone = updatedProfile.shipping_phone || updatedProfile.phone || ''

      setFormData((prev) => ({
        ...prev,
        firstName: firstName || prev.firstName,
        lastName: lastName || prev.lastName,
        email: updatedProfile.email || prev.email,
        phone: updatedPhone || '',
        birthDate: updatedProfile.birth_date ?? prev.birthDate,
        gender: normalizeGender(updatedProfile.gender),
      }))

      const computedMemberSince = formatMemberSince(updatedProfile.created_at)
      if (computedMemberSince) {
        setMemberSince(computedMemberSince)
      }

      setIsEditing(false)
      setSuccess(t('success'))
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error('Failed to update profile:', err)
      setError(err instanceof Error ? err.message : t('errors.updateFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="max-w-4xl mx-auto pt-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">{t('loading')}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto pt-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
        <p className="text-gray-600">{t('subtitle')}</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {/* Profile Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {formData.firstName} {formData.lastName}
              </h2>
              <p className="text-gray-500">{t('memberSince', { date: memberSince })}</p>
            </div>
            <Button
              onClick={() => (isEditing ? setIsEditing(false) : setIsEditing(true))}
              variant="outline"
            >
              {isEditing ? t('cancel') : t('editProfile')}
            </Button>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">{t('fields.firstName')}</Label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                disabled={!isEditing}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">{t('fields.lastName')}</Label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                disabled={!isEditing}
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t('fields.email')}</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!isEditing}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{t('fields.phone')}</Label>
            <div className="relative">
              <Input
                id="phone"
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!isEditing}
                className="w-full"
                placeholder={
                  isEditing
                    ? t('fields.phonePlaceholder')
                    : !formData.phone || formData.phone.trim() === ''
                    ? t('fields.phoneEmpty')
                    : ''
                }
              />
              {formData.phone && formData.phone.trim() !== '' && !isEditing && (
                <div className="text-sm text-green-600 mt-1">{t('fields.phoneSaved')}</div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="birthDate">{t('fields.birthDate')}</Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                disabled={!isEditing}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">{t('fields.gender')}</Label>
              <select
                id="gender"
                value={formData.gender}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    gender: e.target.value as 'male' | 'female' | 'other' | 'prefer_not_to_say',
                  })
                }
                disabled={!isEditing}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-prompt"
              >
                <option value="male">{t('fields.genderOptions.male')}</option>
                <option value="female">{t('fields.genderOptions.female')}</option>
                <option value="other">{t('fields.genderOptions.other')}</option>
                <option value="prefer_not_to_say">{t('fields.genderOptions.preferNotToSay')}</option>
              </select>
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                {t('cancel')}
              </Button>
              <Button type="submit" isLoading={isLoading}>
                {t('saveChanges')}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
