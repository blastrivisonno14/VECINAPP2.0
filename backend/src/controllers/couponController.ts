import { Request, Response } from 'express'
import prisma from '../lib/prisma'
import { createCouponSchema, redeemCouponSchema } from '../validators/couponValidators'
import { randomUUID } from 'crypto'
import qrService from '../services/qrService'

export const createCoupon = async (req: Request, res: Response) => {
  const parsed = createCouponSchema.safeParse({ ...req.body, promotionId: Number(req.params.promotionId) })
  if (!parsed.success) return res.status(400).send({ error: parsed.error.message })
  const promotionId = parsed.data.promotionId
  const userId = parsed.data.userId ?? (req as any).user?.id

  // create coupon entry with temporary qrCode (uuid) to ensure uniqueness
  const temp = randomUUID()
  const coupon = await prisma.coupon.create({
    data: {
      promotion: { connect: { id: promotionId } },
      user: userId ? { connect: { id: userId } } : undefined,
      qrCode: temp,
    },
  })

  // sign a QR token containing couponId and userId
  const token = qrService.signQR({ couponId: coupon.id, userId: coupon.userId ?? null })
  // store the signed token in the coupon.qrCode (replace temp)
  await prisma.coupon.update({ where: { id: coupon.id }, data: { qrCode: token } })

  // generate data URL for the QR to show in dashboard
  const dataUrl = await qrService.generateQRCodeDataUrl(token)

  res.status(201).send({ couponId: coupon.id, qrToken: token, qrDataUrl: dataUrl })
}

export const redeemCoupon = async (req: Request, res: Response) => {
  const parsed = redeemCouponSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).send({ error: parsed.error.message })
  const { qrCode } = parsed.data

  // Accept either raw token (signed) or stored token
  try {
    const payload = qrService.verifyQR(qrCode)
    const coupon = await prisma.coupon.findUnique({ where: { id: payload.couponId } })
    if (!coupon) return res.status(404).send({ error: 'coupon not found' })
    if (coupon.redeemedAt) return res.status(400).send({ error: 'already redeemed' })
    const updated = await prisma.coupon.update({ where: { id: coupon.id }, data: { redeemedAt: new Date() } })
    return res.send({ ok: true, coupon: updated })
  } catch (err) {
    return res.status(400).send({ error: 'invalid token' })
  }
}

export const myCoupons = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id
  if (!userId) return res.status(401).send({ error: 'unauthorized' })
  const coupons = await prisma.coupon.findMany({ where: { userId } })
  res.send(coupons)
}

export const validateQRCode = async (req: Request, res: Response) => {
  // Endpoint for commerce to validate a scanned QR token
  const { token } = req.body
  if (!token) return res.status(400).send({ error: 'missing token' })
  try {
    const payload = qrService.verifyQR(token)
    const coupon = await prisma.coupon.findUnique({ where: { id: payload.couponId }, include: { promotion: true } })
    if (!coupon) return res.status(404).send({ error: 'coupon not found' })

    // Check coupon belongs to promotion of this commerce
    const commerceId = (req as any).user?.commerceId
    if (commerceId && coupon.promotion.commerceId !== commerceId) {
      return res.status(403).send({ error: 'coupon does not belong to this commerce' })
    }

    if (coupon.redeemedAt) return res.status(400).send({ error: 'already redeemed' })

    // Mark as redeemed and return result
    const updated = await prisma.coupon.update({ where: { id: coupon.id }, data: { redeemedAt: new Date() } })
    return res.send({ ok: true, coupon: updated })
  } catch (err) {
    return res.status(400).send({ error: 'invalid or expired token' })
  }
}

export default { createCoupon, redeemCoupon, myCoupons, validateQRCode }
