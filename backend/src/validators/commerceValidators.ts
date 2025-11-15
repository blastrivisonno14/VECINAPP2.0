import { z } from 'zod'

export const createCommerceSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  lat: z.number().optional(),
  lng: z.number().optional(),
  category: z.string().optional(),
  logoUrl: z.string().url().optional(),
})

export const updateCommerceSchema = createCommerceSchema.partial()
