import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['user', 'commerce', 'admin']).optional(),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})
