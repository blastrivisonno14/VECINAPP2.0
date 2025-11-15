import { z } from 'zod'

export const createCouponSchema = z.object({
  promotionId: z.number().optional(),
  userId: z.number().optional(),
})

export const redeemCouponSchema = z.object({
  qrCode: z.string().min(1),
})
