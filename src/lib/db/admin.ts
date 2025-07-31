// Admin utilities for managing database content
import { createClient } from '@libsql/client'

const turso = createClient({
  url: 'libsql://roihin-gr4vity4.aws-ap-northeast-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NTM5NzM5MDcsImlkIjoiZGZmMzQxMDctY2M4NS00MDM2LWFiYTktZTRmODZjMmU2MTFkIiwicmlkIjoiODc5YmRiYmMtZTk5NC00NDBiLWFhZDYtNzcyN2IzMGZhNTE1In0.NJjtV_bnhnyx2jcivmcCXLpdis4Y2M4UCuLFyWcGBnlyFPhkc0DyvqSCCpNM25uI0ERirdaquwVPajOX6912Dw',
})

// List all testimonials
export async function listTestimonials() {
  try {
    const result = await turso.execute('SELECT * FROM testimonials ORDER BY created_at DESC')
    console.log('Testimonials:')
    console.table(result.rows)
    return result.rows
  } catch (error) {
    console.error('Error listing testimonials:', error)
  }
}

// List all site meta
export async function listSiteMeta() {
  try {
    const result = await turso.execute('SELECT * FROM site_meta ORDER BY created_at DESC')
    console.log('Site Meta:')
    console.table(result.rows)
    return result.rows
  } catch (error) {
    console.error('Error listing site meta:', error)
  }
}

// Update a testimonial's active status
export async function toggleTestimonial(id: string, isActive: boolean = true) {
  try {
    const result = await turso.execute({
      sql: 'UPDATE testimonials SET is_active = ?, updated_at = ? WHERE id = ?',
      args: [isActive ? 1 : 0, new Date().toISOString(), id]
    })
    
    console.log(`Testimonial ${id} ${isActive ? 'activated' : 'deactivated'}`)
    return result
  } catch (error) {
    console.error('Error toggling testimonial:', error)
  }
}

// Add new testimonial
export async function addTestimonial(testimonial: {
  id: string
  avatar: string
  date: string
  message: string
  language?: string
}) {
  try {
    const result = await turso.execute({
      sql: `INSERT INTO testimonials 
            (id, avatar, date, message, language, is_active, sort_order, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        testimonial.id,
        testimonial.avatar,
        testimonial.date,
        testimonial.message,
        testimonial.language || 'th',
        1, // is_active
        0, // sort_order
        new Date().toISOString(),
        new Date().toISOString(),
      ]
    })
    
    console.log(`Added testimonial ${testimonial.id}`)
    return result
  } catch (error) {
    console.error('Error adding testimonial:', error)
  }
}

// Update site meta
export async function updateSiteMeta(key: string, value: string | object, language: string = 'th') {
  try {
    const isJson = typeof value === 'object'
    const metaValue = isJson ? null : value as string
    const metaValueJson = isJson ? JSON.stringify(value) : null
    
    // Try to update first
    let result = await turso.execute({
      sql: `UPDATE site_meta 
            SET meta_value = ?, meta_value_json = ?, updated_at = ? 
            WHERE meta_key = ? AND language = ?`,
      args: [metaValue, metaValueJson, new Date().toISOString(), key, language]
    })
    
    // If no rows affected, insert new
    if (result.changes === 0) {
      result = await turso.execute({
        sql: `INSERT INTO site_meta 
              (meta_key, meta_value, meta_value_json, language, is_active, created_at, updated_at) 
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
        args: [key, metaValue, metaValueJson, language, 1, new Date().toISOString(), new Date().toISOString()]
      })
    }
    
    console.log(`Updated site meta: ${key} (${language})`)
    return result
  } catch (error) {
    console.error('Error updating site meta:', error)
  }
}

// CLI interface
async function main() {
  const command = process.argv[2]
  
  switch (command) {
    case 'list-testimonials':
      await listTestimonials()
      break
      
    case 'list-meta':
      await listSiteMeta()
      break
      
    case 'toggle-testimonial':
      const id = process.argv[3]
      const isActive = process.argv[4] !== 'false'
      if (!id) {
        console.error('Please provide testimonial ID')
        return
      }
      await toggleTestimonial(id, isActive)
      break
      
    case 'update-meta':
      const key = process.argv[3]
      const value = process.argv[4]
      const lang = process.argv[5] || 'th'
      if (!key || !value) {
        console.error('Please provide key and value')
        return
      }
      
      // Try to parse as JSON, fallback to string
      let parsedValue: string | object = value
      try {
        parsedValue = JSON.parse(value)
      } catch {
        // Keep as string
      }
      
      await updateSiteMeta(key, parsedValue, lang)
      break
      
    default:
      console.log('Available commands:')
      console.log('  list-testimonials - List all testimonials')
      console.log('  list-meta - List all site meta')
      console.log('  toggle-testimonial <id> [true|false] - Toggle testimonial active status')
      console.log('  update-meta <key> <value> [language] - Update site meta')
      console.log('')
      console.log('Examples:')
      console.log('  npx tsx src/lib/db/admin.ts list-testimonials')
      console.log('  npx tsx src/lib/db/admin.ts toggle-testimonial 1 false')
      console.log('  npx tsx src/lib/db/admin.ts update-meta contact_phone "+66-123-456-789"')
      console.log('  npx tsx src/lib/db/admin.ts update-meta social_links \'{"facebook":"https://facebook.com/roihin","instagram":"@roihin"}\'')
  }
}

// Run if called directly
if (require.main === module) {
  main()
}