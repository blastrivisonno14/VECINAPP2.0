import { z } from 'zod'

export const createPromotionSchema = z.object({
  commerceId: z.number().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  discountType: z.enum(['percent', 'amount', '2x1', 'combo', 'happyhour']),
  discountValue: z.number().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  daysOfWeek: z.array(z.enum(['monday','tuesday','wednesday','thursday','friday','saturday','sunday'])).optional(),
  maxCoupons: z.number().int().optional(),
  isActive: z.boolean().optional(),
})

export const updatePromotionSchema = createPromotionSchema.partial()
