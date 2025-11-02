export interface Testimonial {
  id: string
  avatar: string
  message: string
  date: string
  isActive?: boolean
  sortOrder?: number | null
  reviewImage?: string | null
}

export interface TestimonialsResponse {
  testimonials: Testimonial[]
  error?: string
  message?: string
}
