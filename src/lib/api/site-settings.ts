import { getFetchConfig } from '@/config/cache.config'
import type { SiteSettings } from '@/lib/types/site-settings'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

/**
 * Get site settings from WordPress API
 * @returns Site settings object
 */
export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const url = `${API_BASE_URL}/site-settings`

    const response = await fetch(url, {
      ...getFetchConfig('siteSettings'),
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch site settings: ${response.status}`)
    }

    const data = await response.json()
    return data.settings || null
  } catch (error) {
    console.error('Error fetching site settings:', error)
    // Return fallback settings
    return {
      contact: {
        address: '101/54 หมู่บ้าน ภัสสร 70 (เกาะแก้ว) หมู่ที่ 4 ตำบลเกาะแก้ว อ.เมืองภูเก็ต จ.ภูเก็ต 83000',
        phone: '083 826 5195',
        email: 'info.roihin@gmail.com',
        hours: 'Monday - Saturday | 09:00 - 19:00',
      },
      socialLinks: {
        facebook: 'https://www.facebook.com/roihin42896395',
        instagram: 'https://www.instagram.com/roihinth/',
        youtube: 'https://www.youtube.com/@roihinTH',
        tiktok: 'https://www.tiktok.com/@ceo_roihin',
        pinterest: 'https://www.pinterest.com/Roihin_th/',
        line: 'https://lin.ee/r94Dnio',
      },
    }
  }
}

/**
 * Helper functions to match the old siteMetaHelpers interface
 */
export const siteMetaHelpers = {
  /**
   * Get contact information
   * @returns Contact information
   */
  async getContactInfo() {
    const settings = await getSiteSettings()
    return settings?.contact || null
  },

  /**
   * Get social links
   * @returns Social links
   */
  async getSocialLinks() {
    const settings = await getSiteSettings()
    return settings?.socialLinks || null
  },
}
