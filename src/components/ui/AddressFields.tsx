'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import PhoneInput from '@/components/ui/PhoneInput'
import ProvinceSelect from '@/components/ui/ProvinceSelect'

/**
 * Shipping-address field set matching the new backend contract:
 * first_name, last_name, address, apartment (optional), postal_code, city,
 * province (dropdown-backed) and phone.
 *
 * Laid out to mirror the reference form (First/Last, Address, Apartment,
 * Postal code/City, Province/Phone) and shared by the member address modal
 * and the checkout confirmation form.
 */
export interface AddressFieldValues {
  first_name: string
  last_name: string
  address: string
  apartment: string
  postal_code: string
  city: string
  province: string
  phone: string
}

export interface AddressFieldLabels {
  firstName: string
  lastName: string
  address: string
  addressPlaceholder?: string
  apartment: string
  apartmentPlaceholder?: string
  postalCode: string
  city: string
  province: string
  provincePlaceholder: string
  phone: string
  phonePlaceholder?: string
}

interface AddressFieldsProps {
  values: AddressFieldValues
  onFieldChange: (field: keyof AddressFieldValues, value: string) => void
  labels: AddressFieldLabels
  locale: string
  phoneCountry: string
  onPhoneCountryChange: (code: string) => void
  disabled?: boolean
  /** Rendered after each required label (e.g. a red asterisk). */
  requiredMarker?: React.ReactNode
  /** Prefix applied to field ids to keep them unique across forms. */
  idPrefix?: string
}

export default function AddressFields({
  values,
  onFieldChange,
  labels,
  locale,
  phoneCountry,
  onPhoneCountryChange,
  disabled = false,
  requiredMarker,
  idPrefix = '',
}: AddressFieldsProps) {
  const fieldId = (name: string) => `${idPrefix}${name}`

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={fieldId('first_name')}>
            {labels.firstName} {requiredMarker}
          </Label>
          <Input
            id={fieldId('first_name')}
            type="text"
            value={values.first_name}
            onChange={(event) => onFieldChange('first_name', event.target.value)}
            disabled={disabled}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={fieldId('last_name')}>
            {labels.lastName} {requiredMarker}
          </Label>
          <Input
            id={fieldId('last_name')}
            type="text"
            value={values.last_name}
            onChange={(event) => onFieldChange('last_name', event.target.value)}
            disabled={disabled}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={fieldId('address')}>
          {labels.address} {requiredMarker}
        </Label>
        <Input
          id={fieldId('address')}
          type="text"
          placeholder={labels.addressPlaceholder}
          value={values.address}
          onChange={(event) => onFieldChange('address', event.target.value)}
          disabled={disabled}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={fieldId('apartment')}>{labels.apartment}</Label>
        <Input
          id={fieldId('apartment')}
          type="text"
          placeholder={labels.apartmentPlaceholder}
          value={values.apartment}
          onChange={(event) => onFieldChange('apartment', event.target.value)}
          disabled={disabled}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={fieldId('postal_code')}>
            {labels.postalCode} {requiredMarker}
          </Label>
          <Input
            id={fieldId('postal_code')}
            type="text"
            inputMode="numeric"
            maxLength={5}
            pattern="[0-9]{5}"
            value={values.postal_code}
            onChange={(event) => onFieldChange('postal_code', event.target.value)}
            disabled={disabled}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={fieldId('city')}>
            {labels.city} {requiredMarker}
          </Label>
          <Input
            id={fieldId('city')}
            type="text"
            value={values.city}
            onChange={(event) => onFieldChange('city', event.target.value)}
            disabled={disabled}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={fieldId('province')}>
            {labels.province} {requiredMarker}
          </Label>
          <ProvinceSelect
            id={fieldId('province')}
            value={values.province}
            onChange={(value) => onFieldChange('province', value)}
            locale={locale}
            placeholder={labels.provincePlaceholder}
            disabled={disabled}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={fieldId('phone')}>
            {labels.phone} {requiredMarker}
          </Label>
          <PhoneInput
            id={fieldId('phone')}
            lang={locale}
            country={phoneCountry}
            phone={values.phone}
            onCountryChange={onPhoneCountryChange}
            onPhoneChange={(phone) => onFieldChange('phone', phone)}
            placeholder={labels.phonePlaceholder}
            disabled={disabled}
            required
          />
        </div>
      </div>
    </div>
  )
}
