export interface Testimonial {
  id: string
  avatar: string
  message: string
  date: string
  isActive?: boolean
  sortOrder?: number | null
  reviewImage?: string | null
}

export interface TestimonialsPagination {
  page: number
  perPage: number
  total: number
  totalPages: number
}

export interface TestimonialsResponse {
  testimonials: Testimonial[]
  pagination?: TestimonialsPagination
  error?: string
  message?: string
}
