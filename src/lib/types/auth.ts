import { z } from 'zod'

/**
 * Centralized Authentication Type Definitions
 *
 * This file contains all authentication-related types and Zod validation schemas
 * for the Laravel backend integration.
 */

// ============================================================================
// Request Types (Client -> API)
// ============================================================================

export interface RegisterData {
  first_name: string
  last_name: string
  email: string
  phone: string
  password: string
  password_confirmation: string
  accept_terms?: boolean
}

export interface LoginData {
  email: string
  password: string
}

export interface ForgotPasswordData {
  email: string
}

export interface ResetPasswordData {
  email: string
  token: string
  password: string
  password_confirmation: string
}

// ============================================================================
// Response Types with Zod Validation Schemas
// ============================================================================

/**
 * User schema matching Laravel UserResource
 */
export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().nullable(),
  roles: z.array(z.string()),
  shipping_phone: z.string().nullable(),
  shipping_address: z.string().nullable(),
  shipping_district: z.string().nullable(),
  shipping_amphoe: z.string().nullable(),
  shipping_province: z.string().nullable(),
  shipping_zipcode: z.string().nullable(),
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
})

/**
 * Authentication response schema (register/login)
 * Matches Laravel Sanctum token response from BaseAuthController
 */
export const AuthResponseSchema = z.object({
  token: z.string(),
  token_type: z.literal('Bearer'),
  expires_at: z.string().nullable(),
  user: UserSchema,
  meta: z.object({
    locale: z.string(),
  }),
})

/**
 * Forgot password response schema
 */
export const ForgotPasswordResponseSchema = z.object({
  message: z.string(),
  meta: z.object({
    locale: z.string(),
  }),
})

/**
 * Laravel validation error schema
 */
export const ValidationErrorSchema = z.object({
  message: z.string(),
  errors: z.record(z.string(), z.array(z.string())),
})

// ============================================================================
// Type Exports (Inferred from Zod schemas)
// ============================================================================

export type User = z.infer<typeof UserSchema>
export type AuthResponse = z.infer<typeof AuthResponseSchema>
export type ForgotPasswordResponse = z.infer<typeof ForgotPasswordResponseSchema>
export type ValidationError = z.infer<typeof ValidationErrorSchema>

// ============================================================================
// Helper Types
// ============================================================================

/**
 * Simplified user type for AuthContext (backwards compatibility)
 */
export interface SimpleUser {
  id: number
  name: string
  email: string
  phone?: string | null
}

/**
 * Convert full User to SimpleUser
 */
export function toSimpleUser(user: User): SimpleUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
  }
}
