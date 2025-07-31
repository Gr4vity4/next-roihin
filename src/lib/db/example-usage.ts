// Example usage of the database functions
import { 
  getTestimonials, 
  getTestimonialById, 
  createTestimonial,
  updateTestimonial,
  deleteTestimonial 
} from './testimonials'

import { 
  getSiteMetaValue, 
  getSiteMetaJson, 
  setSiteMetaValue,
  setSiteMetaJson,
  siteMetaHelpers 
} from './site-meta'

// Example functions showing how to use the database integration

// 1. Fetching testimonials for display
export async function getTestimonialsForDisplay(language: string = 'th') {
  try {
    const testimonials = await getTestimonials(language)
    console.log(`Found ${testimonials.length} testimonials in ${language}`)
    return testimonials
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return []
  }
}

// 2. Adding a new testimonial
export async function addNewTestimonial(testimonialData: {
  id: string
  avatar: string
  date: string
  message: string
  language?: string
}) {
  try {
    const testimonial = await createTestimonial({
      ...testimonialData,
      language: testimonialData.language || 'th',
      isActive: true,
      sortOrder: 0,
    })
    console.log('Added new testimonial:', testimonial.id)
    return testimonial
  } catch (error) {
    console.error('Error adding testimonial:', error)
    throw error
  }
}

// 3. Managing site settings
export async function updateContactInfo(language: string = 'th') {
  try {
    const contactInfo = {
      address: 'ROIHIN STONE & BRACELET, Bangkok, Thailand',
      phone: '+66-xxx-xxx-xxxx',
      email: 'contact@roihinstone.com',
      hours: 'Mon-Sat 10:00-19:00, Sun 11:00-18:00',
    }
    
    await siteMetaHelpers.setContactInfo(contactInfo, language)
    console.log('Updated contact info for', language)
  } catch (error) {
    console.error('Error updating contact info:', error)
    throw error
  }
}

// 4. Managing social links
export async function updateSocialLinks(language: string = 'th') {
  try {
    const socialLinks = {
      facebook: 'https://facebook.com/roihinstone',
      instagram: 'https://instagram.com/roihinstone',
      line: '@roihinstone',
      tiktok: '@roihinstone',
    }
    
    await siteMetaHelpers.setSocialLinks(socialLinks, language)
    console.log('Updated social links for', language)
  } catch (error) {
    console.error('Error updating social links:', error)
    throw error
  }
}

// 5. Getting site settings for components
export async function getSiteSettings(language: string = 'th') {
  try {
    const [contactInfo, socialLinks, aboutUs] = await Promise.all([
      siteMetaHelpers.getContactInfo(language),
      siteMetaHelpers.getSocialLinks(language),
      siteMetaHelpers.getAboutUs(language),
    ])
    
    return {
      contactInfo,
      socialLinks,
      aboutUs,
    }
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return {
      contactInfo: null,
      socialLinks: null,
      aboutUs: null,
    }
  }
}

// 6. Example of how to use in a React Server Component
export async function getPageData(language: string = 'th') {
  try {
    const [testimonials, siteSettings] = await Promise.all([
      getTestimonialsForDisplay(language),
      getSiteSettings(language),
    ])
    
    return {
      testimonials,
      siteSettings,
    }
  } catch (error) {
    console.error('Error fetching page data:', error)
    return {
      testimonials: [],
      siteSettings: {
        contactInfo: null,
        socialLinks: null,
        aboutUs: null,
      },
    }
  }
}

// 7. Admin functions
export async function toggleTestimonialVisibility(id: string, isActive: boolean) {
  try {
    const updated = await updateTestimonial(id, { isActive })
    console.log(`Testimonial ${id} visibility changed to ${isActive}`)
    return updated
  } catch (error) {
    console.error('Error toggling testimonial visibility:', error)
    throw error
  }
}

// 8. Bilingual content management
export async function createBilingualContent(
  thaiContent: string,
  englishContent: string,
  key: string
) {
  try {
    await Promise.all([
      setSiteMetaValue(key, thaiContent, 'th'),
      setSiteMetaValue(key, englishContent, 'en'),
    ])
    console.log(`Created bilingual content for ${key}`)
  } catch (error) {
    console.error('Error creating bilingual content:', error)
    throw error
  }
}

// Export all functions for use in other parts of the application
export {
  getTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getSiteMetaValue,
  getSiteMetaJson,
  setSiteMetaValue,
  setSiteMetaJson,
  siteMetaHelpers,
}