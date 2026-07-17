'use client'

import Button from '@/components/Button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import PhoneInput from '@/components/ui/PhoneInput'
import { combinePhone, splitPhone } from '@/lib/data/countries'
import { useLocale, useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'

interface Address {
  id: string
  full_name: string
  phone: string
  address: string
  subdistrict: string
  district: string
  province: string
  postal_code: string
  country: string
  created_at: number
  updated_at: number
  is_default: boolean
}

export default function AddressesPage() {
  const t = useTranslations('member.addresses')
  const locale = useLocale()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [setAsDefault, setSetAsDefault] = useState(false)
  const [phoneCountry, setPhoneCountry] = useState('th')

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address: '',
    subdistrict: '',
    district: '',
    province: '',
    postal_code: '',
  })

  const fetchAddresses = useCallback(async () => {
    try {
      setIsFetching(true)
      setError(null)

      const response = await fetch('/api/addresses')

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || t('errors.loadFailed'))
      }

      const data = await response.json()
      setAddresses(data.items || [])
    } catch (err) {
      console.error('Failed to fetch addresses:', err)
      setError(err instanceof Error ? err.message : t('errors.loadFailed'))
    } finally {
      setIsFetching(false)
    }
  }, [t])

  useEffect(() => {
    fetchAddresses()
  }, [fetchAddresses])

  const handleAddAddress = () => {
    setPhoneCountry('th')
    setFormData({
      full_name: '',
      phone: '',
      address: '',
      subdistrict: '',
      district: '',
      province: '',
      postal_code: '',
    })
    setSetAsDefault(false)
    setEditingAddress(null)
    setIsAddModalOpen(true)
  }

  const handleEditAddress = (address: Address) => {
    const parsedPhone = splitPhone(address.phone)
    setPhoneCountry(parsedPhone.country)
    setFormData({
      full_name: address.full_name,
      phone: parsedPhone.phone,
      address: address.address,
      subdistrict: address.subdistrict,
      district: address.district,
      province: address.province,
      postal_code: address.postal_code,
    })
    setEditingAddress(address)
    setIsAddModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (editingAddress) {
        const response = await fetch(`/api/addresses/${editingAddress.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            phone: combinePhone(phoneCountry, formData.phone),
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || t('errors.updateFailed'))
        }

        await fetchAddresses()
      } else {
        const response = await fetch('/api/addresses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            phone: combinePhone(phoneCountry, formData.phone),
            country: 'TH',
            set_default: setAsDefault,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || t('errors.createFailed'))
        }

        await fetchAddresses()
      }

      setIsAddModalOpen(false)
    } catch (err) {
      console.error('Failed to save address:', err)
      setError(err instanceof Error ? err.message : editingAddress ? t('errors.updateFailed') : t('errors.createFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetDefault = async (id: string) => {
    try {
      setError(null)

      const response = await fetch(`/api/addresses/${id}/default`, {
        method: 'POST',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || t('errors.setDefaultFailed'))
      }

      await fetchAddresses()
    } catch (err) {
      console.error('Failed to set default:', err)
      setError(err instanceof Error ? err.message : t('errors.setDefaultFailed'))
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setError(null)

      const response = await fetch(`/api/addresses/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || t('errors.deleteFailed'))
      }

      await fetchAddresses()
    } catch (err) {
      console.error('Failed to delete:', err)
      setError(err instanceof Error ? err.message : t('errors.deleteFailed'))
    }
  }

  if (isFetching) {
    return (
      <div className="max-w-7xl mx-auto pt-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">{t('loading')}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto pt-8 font-prompt">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>
        <Button onClick={handleAddAddress}>
          {t('addNew')}
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Address Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {addresses.map((address) => (
          <div key={address.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {address.is_default && (
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 mb-3">
                {t('defaultBadge')}
              </span>
            )}

            <div className="space-y-2 mb-4">
              <p className="font-semibold text-gray-900">{address.full_name}</p>
              <p className="text-gray-600">{address.phone}</p>
              <p className="text-gray-600">
                {address.address}<br />
                {address.subdistrict}, {address.district}<br />
                {address.province} {address.postal_code}
              </p>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditAddress(address)}
              >
                {t('edit')}
              </Button>
              {!address.is_default && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetDefault(address.id)}
                  >
                    {t('setAsDefault')}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(address.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    {t('delete')}
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {addresses.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('empty.title')}</h3>
          <p className="text-gray-500 mb-6">{t('empty.subtitle')}</p>
          <Button onClick={handleAddAddress}>
            {t('empty.addAddress')}
          </Button>
        </div>
      )}

      {/* Add/Edit Address Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? t('form.editTitle') : t('form.addTitle')}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">{t('form.fullName')}</Label>
              <Input
                id="full_name"
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{t('form.phone')}</Label>
              <PhoneInput
                id="phone"
                lang={locale}
                country={phoneCountry}
                phone={formData.phone}
                onCountryChange={setPhoneCountry}
                onPhoneChange={(phone) => setFormData({ ...formData, phone })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">{t('form.address')}</Label>
              <Input
                id="address"
                type="text"
                placeholder={t('form.addressPlaceholder')}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subdistrict">{t('form.subdistrict')}</Label>
                <Input
                  id="subdistrict"
                  type="text"
                  value={formData.subdistrict}
                  onChange={(e) => setFormData({ ...formData, subdistrict: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">{t('form.district')}</Label>
                <Input
                  id="district"
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="province">{t('form.province')}</Label>
                <Input
                  id="province"
                  type="text"
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postal_code">{t('form.postalCode')}</Label>
                <Input
                  id="postal_code"
                  type="text"
                  value={formData.postal_code}
                  onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                  required
                />
              </div>
            </div>

            {!editingAddress && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="setDefault"
                  checked={setAsDefault}
                  onChange={(e) => setSetAsDefault(e.target.checked)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <Label htmlFor="setDefault" className="text-sm font-medium text-gray-700">
                  {t('form.setDefault')}
                </Label>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
              >
                {t('form.cancel')}
              </Button>
              <Button type="submit" isLoading={isLoading}>
                {editingAddress ? t('form.update') : t('form.add')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}