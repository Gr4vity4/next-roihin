export interface SiteSettingsContact {
  address?: string
  phone?: string
  email?: string
  hours?: string
  [key: string]: string | undefined
}

export interface SiteSettingsSocialLinks {
  facebook?: string
  instagram?: string
  youtube?: string
  tiktok?: string
  pinterest?: string
  line?: string
  [key: string]: string | undefined
}

export interface SiteSettings {
  contact?: SiteSettingsContact | null
  socialLinks?: SiteSettingsSocialLinks | null
  [key: string]: unknown
}
