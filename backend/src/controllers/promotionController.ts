import { Request, Response } from 'express'
import prisma from '../lib/prisma'
import { createPromotionSchema, updatePromotionSchema } from '../validators/promotionValidators'

export const createPromotion = async (req: Request, res: Response) => {
  const parsed = createPromotionSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).send({ error: parsed.error.message })
  // commerceId could be in body or taken from authenticated user's commerce ownership
  const commerceId = parsed.data.commerceId ?? (req as any).user?.commerceId
  if (!commerceId) return res.status(400).send({ error: 'missing commerceId' })
  // initialize remainingCoupons
  const max = parsed.data.maxCoupons ?? null
  const remaining = max ?? 0
  const promotion = await prisma.promotion.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description ?? '',
      imageUrl: parsed.data.imageUrl,
      discountType: (parsed.data.discountType.toUpperCase()) as any,
      discountValue: parsed.data.discountValue ?? null,
      startDate: parsed.data.startDate ? new Date(parsed.data.startDate) : null,
      endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
      daysOfWeek: (parsed.data.daysOfWeek ?? []).map(d => d.toUpperCase()) as any,
      maxCoupons: parsed.data.maxCoupons ?? null,
      remainingCoupons: remaining,
      isActive: true,
      commerce: { connect: { id: commerceId } },
    },
  })
  res.status(201).send(promotion)
}

export const listPromotions = async (req: Request, res: Response) => {
  const promotions = await prisma.promotion.findMany({ where: { isActive: true }, take: 100 })
  res.send(promotions)
}

export const nearbyPromotions = async (req: Request, res: Response) => {
  const lat = parseFloat(String(req.query.lat))
  const lng = parseFloat(String(req.query.lng))
  if (Number.isNaN(lat) || Number.isNaN(lng)) return res.status(400).send({ error: 'invalid coords' })
  // Simple proximity filter using bounding box ~0.02 degrees (~2km). For production use PostGIS.
  const delta = 0.02
  const promotions = await prisma.promotion.findMany({
    where: {
      isActive: true,
      commerce: {
        lat: { gte: lat - delta, lte: lat + delta },
        lng: { gte: lng - delta, lte: lng + delta },
      },
    },
    include: { commerce: true },
    take: 200,
  })
  res.send(promotions)
}

export const getPromotion = async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const p = await prisma.promotion.findUnique({ where: { id } })
  if (!p) return res.status(404).send({ error: 'not found' })
  res.send(p)
}

export const updatePromotion = async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const parsed = updatePromotionSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).send({ error: parsed.error.message })
  const existing = await prisma.promotion.findUnique({ where: { id } })
  if (!existing) return res.status(404).send({ error: 'not found' })
  // Only commerce owner or admin
  const user = (req as any).user
  const commerce = await prisma.commerce.findUnique({ where: { id: existing.commerceId } })
  if (!commerce) return res.status(404).send({ error: 'commerce not found' })
  if (user?.id !== commerce.ownerId && user?.role !== 'ADMIN') return res.status(403).send({ error: 'forbidden' })
  const updateData: any = { ...parsed.data }
  if (updateData.discountType) {
    updateData.discountType = updateData.discountType.toUpperCase()
  }
  if (updateData.daysOfWeek) {
    updateData.daysOfWeek = updateData.daysOfWeek.map((d: string) => d.toUpperCase())
  }
  if (updateData.startDate) updateData.startDate = new Date(updateData.startDate)
  if (updateData.endDate) updateData.endDate = new Date(updateData.endDate)
  if (updateData.description === undefined) delete updateData.description
  if (updateData.commerceId) {
    updateData.commerce = { connect: { id: updateData.commerceId } }
    delete updateData.commerceId
  }
  const updated = await prisma.promotion.update({ where: { id }, data: updateData })
  res.send(updated)
}

export const pausePromotion = async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const existing = await prisma.promotion.findUnique({ where: { id } })
  if (!existing) return res.status(404).send({ error: 'not found' })
  const user = (req as any).user
  const commerce = await prisma.commerce.findUnique({ where: { id: existing.commerceId } })
  if (!commerce) return res.status(404).send({ error: 'commerce not found' })
  if (user?.id !== commerce.ownerId && user?.role !== 'ADMIN') return res.status(403).send({ error: 'forbidden' })
  const updated = await prisma.promotion.update({ where: { id }, data: { isActive: false } })
  res.send(updated)
}

export const activatePromotion = async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const existing = await prisma.promotion.findUnique({ where: { id } })
  if (!existing) return res.status(404).send({ error: 'not found' })
  const user = (req as any).user
  const commerce = await prisma.commerce.findUnique({ where: { id: existing.commerceId } })
  if (!commerce) return res.status(404).send({ error: 'commerce not found' })
  if (user?.id !== commerce.ownerId && user?.role !== 'ADMIN') return res.status(403).send({ error: 'forbidden' })
  const updated = await prisma.promotion.update({ where: { id }, data: { isActive: true } })
  res.send(updated)
}

export default {
  createPromotion,
  listPromotions,
  nearbyPromotions,
  getPromotion,
  updatePromotion,
  pausePromotion,
  activatePromotion,
}
