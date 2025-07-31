import { eq, desc, and } from 'drizzle-orm'
import { db } from './index'
import { testimonials, type Testimonial, type NewTestimonial } from './schema'

// Get all active testimonials, ordered by sort_order and created_at
export async function getTestimonials(language?: string): Promise<Testimonial[]> {
  try {
    const whereConditions = [eq(testimonials.isActive, true)]
    
    if (language) {
      whereConditions.push(eq(testimonials.language, language))
    }

    const result = await db
      .select()
      .from(testimonials)
      .where(and(...whereConditions))
      .orderBy(testimonials.sortOrder, desc(testimonials.createdAt))

    return result
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    throw new Error('Failed to fetch testimonials')
  }
}

// Get a single testimonial by ID
export async function getTestimonialById(id: string): Promise<Testimonial | null> {
  try {
    const result = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.id, id))
      .limit(1)

    return result[0] || null
  } catch (error) {
    console.error('Error fetching testimonial:', error)
    throw new Error('Failed to fetch testimonial')
  }
}

// Create a new testimonial
export async function createTestimonial(testimonial: NewTestimonial): Promise<Testimonial> {
  try {
    const result = await db
      .insert(testimonials)
      .values({
        ...testimonial,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning()

    return result[0]
  } catch (error) {
    console.error('Error creating testimonial:', error)
    throw new Error('Failed to create testimonial')
  }
}

// Update a testimonial
export async function updateTestimonial(
  id: string, 
  updates: Partial<NewTestimonial>
): Promise<Testimonial | null> {
  try {
    const result = await db
      .update(testimonials)
      .set({
        ...updates,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(testimonials.id, id))
      .returning()

    return result[0] || null
  } catch (error) {
    console.error('Error updating testimonial:', error)
    throw new Error('Failed to update testimonial')
  }
}

// Delete a testimonial (soft delete by setting isActive to false)
export async function deleteTestimonial(id: string): Promise<boolean> {
  try {
    const result = await db
      .update(testimonials)
      .set({
        isActive: false,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(testimonials.id, id))
      .returning()

    return result.length > 0
  } catch (error) {
    console.error('Error deleting testimonial:', error)
    throw new Error('Failed to delete testimonial')
  }
}

// Bulk insert testimonials (useful for seeding)
export async function bulkCreateTestimonials(testimonials_data: NewTestimonial[]): Promise<number> {
  try {
    const timestampedData = testimonials_data.map(testimonial => ({
      ...testimonial,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }))

    const result = await db
      .insert(testimonials)
      .values(timestampedData)
      .returning()

    return result.length
  } catch (error) {
    console.error('Error bulk creating testimonials:', error)
    throw new Error('Failed to bulk create testimonials')
  }
}