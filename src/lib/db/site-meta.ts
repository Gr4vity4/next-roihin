import { eq, and } from 'drizzle-orm'
import { db } from './index'
import { siteMeta, type SiteMeta, type NewSiteMeta } from './schema'

// Get site meta value by key
export async function getSiteMetaValue(
  key: string, 
  language: string = 'th'
): Promise<string | null> {
  try {
    const result = await db
      .select({ metaValue: siteMeta.metaValue })
      .from(siteMeta)
      .where(
        and(
          eq(siteMeta.metaKey, key),
          eq(siteMeta.language, language),
          eq(siteMeta.isActive, true)
        )
      )
      .limit(1)

    return result[0]?.metaValue || null
  } catch (error) {
    console.error('Error fetching site meta value:', error)
    throw new Error('Failed to fetch site meta value')
  }
}

// Get site meta JSON value by key
export async function getSiteMetaJson<T = any>(
  key: string, 
  language: string = 'th'
): Promise<T | null> {
  try {
    const result = await db
      .select({ metaValueJson: siteMeta.metaValueJson })
      .from(siteMeta)
      .where(
        and(
          eq(siteMeta.metaKey, key),
          eq(siteMeta.language, language),
          eq(siteMeta.isActive, true)
        )
      )
      .limit(1)

    if (!result[0]?.metaValueJson) return null

    return JSON.parse(result[0].metaValueJson) as T
  } catch (error) {
    console.error('Error fetching site meta JSON value:', error)
    throw new Error('Failed to fetch site meta JSON value')
  }
}

// Get all site meta for a language
export async function getAllSiteMeta(language: string = 'th'): Promise<SiteMeta[]> {
  try {
    const result = await db
      .select()
      .from(siteMeta)
      .where(
        and(
          eq(siteMeta.language, language),
          eq(siteMeta.isActive, true)
        )
      )

    return result
  } catch (error) {
    console.error('Error fetching all site meta:', error)
    throw new Error('Failed to fetch all site meta')
  }
}

// Set site meta value
export async function setSiteMetaValue(
  key: string,
  value: string,
  language: string = 'th'
): Promise<SiteMeta> {
  try {
    // Try to update existing record first
    const existing = await db
      .select()
      .from(siteMeta)
      .where(
        and(
          eq(siteMeta.metaKey, key),
          eq(siteMeta.language, language)
        )
      )
      .limit(1)

    if (existing.length > 0) {
      // Update existing
      const result = await db
        .update(siteMeta)
        .set({
          metaValue: value,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(siteMeta.id, existing[0].id))
        .returning()

      return result[0]
    } else {
      // Create new
      const result = await db
        .insert(siteMeta)
        .values({
          metaKey: key,
          metaValue: value,
          language,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .returning()

      return result[0]
    }
  } catch (error) {
    console.error('Error setting site meta value:', error)
    throw new Error('Failed to set site meta value')
  }
}

// Set site meta JSON value
export async function setSiteMetaJson<T = any>(
  key: string,
  value: T,
  language: string = 'th'
): Promise<SiteMeta> {
  try {
    const jsonValue = JSON.stringify(value)

    // Try to update existing record first
    const existing = await db
      .select()
      .from(siteMeta)
      .where(
        and(
          eq(siteMeta.metaKey, key),
          eq(siteMeta.language, language)
        )
      )
      .limit(1)

    if (existing.length > 0) {
      // Update existing
      const result = await db
        .update(siteMeta)
        .set({
          metaValueJson: jsonValue,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(siteMeta.id, existing[0].id))
        .returning()

      return result[0]
    } else {
      // Create new
      const result = await db
        .insert(siteMeta)
        .values({
          metaKey: key,
          metaValueJson: jsonValue,
          language,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .returning()

      return result[0]
    }
  } catch (error) {
    console.error('Error setting site meta JSON value:', error)
    throw new Error('Failed to set site meta JSON value')
  }
}

// Delete site meta (soft delete)
export async function deleteSiteMeta(key: string, language: string = 'th'): Promise<boolean> {
  try {
    const result = await db
      .update(siteMeta)
      .set({
        isActive: false,
        updatedAt: new Date().toISOString(),
      })
      .where(
        and(
          eq(siteMeta.metaKey, key),
          eq(siteMeta.language, language)
        )
      )
      .returning()

    return result.length > 0
  } catch (error) {
    console.error('Error deleting site meta:', error)
    throw new Error('Failed to delete site meta')
  }
}

// Common site meta helper functions
export const siteMetaHelpers = {
  // Contact information
  async getContactInfo(language: string = 'th') {
    return await getSiteMetaJson<{
      address: string
      phone: string
      email: string
      hours: string
    }>('contact_info', language)
  },

  async setContactInfo(info: {
    address: string
    phone: string
    email: string
    hours: string
  }, language: string = 'th') {
    return await setSiteMetaJson('contact_info', info, language)
  },

  // Social links
  async getSocialLinks(language: string = 'th') {
    return await getSiteMetaJson<{
      facebook?: string
      instagram?: string
      line?: string
      tiktok?: string
    }>('social_links', language)
  },

  async setSocialLinks(links: {
    facebook?: string
    instagram?: string
    line?: string
    tiktok?: string
  }, language: string = 'th') {
    return await setSiteMetaJson('social_links', links, language)
  },

  // About us content
  async getAboutUs(language: string = 'th') {
    return await getSiteMetaValue('about_us', language)
  },

  async setAboutUs(content: string, language: string = 'th') {
    return await setSiteMetaValue('about_us', content, language)
  },
}