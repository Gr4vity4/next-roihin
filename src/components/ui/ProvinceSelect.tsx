'use client'

import { cn } from '@/lib/utils'
import { useProvinces } from '@/hooks/useProvinces'

interface ProvinceSelectProps {
  id?: string
  name?: string
  value: string
  onChange: (value: string) => void
  locale: string
  disabled?: boolean
  required?: boolean
  className?: string
  /** Text for the empty option, e.g. "Select province" */
  placeholder?: string
}

/**
 * Locale-aware province dropdown backed by `GET /api/provinces`.
 * Submits the canonical English `value`; renders the localized `label`.
 *
 * If `value` is set but not present in the loaded list (e.g. a legacy
 * free-text province from before the backend migration), it is still shown as
 * a fallback option so the field never silently loses the user's data.
 */
export default function ProvinceSelect({
  id,
  name,
  value,
  onChange,
  locale,
  disabled = false,
  required = false,
  className,
  placeholder = 'Select province',
}: ProvinceSelectProps) {
  const { provinces, isLoading, error, reload } = useProvinces(locale)
  const isThai = locale === 'th'

  const hasValue = value.trim().length > 0
  const isKnown = provinces.some((province) => province.value === value)
  // Only a hard failure (nothing loaded) should degrade the control; a stale
  // error alongside a populated list is harmless.
  const loadFailed = Boolean(error) && provinces.length === 0

  return (
    <div>
      <select
        id={id}
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled || (isLoading && provinces.length === 0)}
        required={required}
        className={cn(
          'flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-prompt',
          loadFailed ? 'border-red-500' : 'border-gray-200',
          !hasValue && 'text-gray-500',
          className
        )}
      >
        <option value="">{placeholder}</option>
        {hasValue && !isKnown && <option value={value}>{value}</option>}
        {provinces.map((province) => (
          <option key={province.value} value={province.value}>
            {province.label}
          </option>
        ))}
      </select>
      {loadFailed && (
        <p className="mt-1 text-xs text-red-500">
          {isThai ? 'ไม่สามารถโหลดจังหวัดได้' : 'Could not load provinces.'}{' '}
          <button type="button" onClick={reload} className="font-medium underline">
            {isThai ? 'ลองอีกครั้ง' : 'Retry'}
          </button>
        </p>
      )}
    </div>
  )
}
