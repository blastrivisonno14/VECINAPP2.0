import { Request, Response } from 'express'
import prisma from '../lib/prisma'

export const pendingPromotions = async (req: Request, res: Response) => {
  // Example: promotions that are inactive but awaiting approval; extend with real workflow
  const promos = await prisma.promotion.findMany({ where: { isActive: false }, take: 200, include: { commerce: true } })
  res.send(promos)
}

export const approvePromotion = async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const promotion = await prisma.promotion.findUnique({ where: { id } })
  if (!promotion) return res.status(404).send({ error: 'not found' })
  const updated = await prisma.promotion.update({ where: { id }, data: { isActive: true } })
  res.send(updated)
}

export const deletePromotionAdmin = async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const promotion = await prisma.promotion.findUnique({ where: { id } })
  if (!promotion) return res.status(404).send({ error: 'not found' })
  await prisma.promotion.delete({ where: { id } })
  res.send({ ok: true })
}

export const activateCommerce = async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const commerce = await prisma.commerce.findUnique({ where: { id } })
  if (!commerce) return res.status(404).send({ error: 'not found' })
  const updated = await prisma.commerce.update({ where: { id }, data: { isActive: true } })
  res.send(updated)
}

export const deactivateCommerce = async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const commerce = await prisma.commerce.findUnique({ where: { id } })
  if (!commerce) return res.status(404).send({ error: 'not found' })
  const updated = await prisma.commerce.update({ where: { id }, data: { isActive: false } })
  res.send(updated)
}

export const stats = async (req: Request, res: Response) => {
  const usersCount = await prisma.user.count()
  const commercesCount = await prisma.commerce.count()
  const promotionsCount = await prisma.promotion.count()
  const activePromotions = await prisma.promotion.count({ where: { isActive: true } })
  const couponsCount = await prisma.coupon.count()
  res.send({ usersCount, commercesCount, promotionsCount, activePromotions, couponsCount })
}

export const search = async (req: Request, res: Response) => {
  const q = String(req.query.q || '')
  const type = String(req.query.type || 'user')
  if (!q) return res.status(400).send({ error: 'missing query' })
  if (type === 'commerce') {
    const commerces = await prisma.commerce.findMany({ where: { OR: [{ name: { contains: q, mode: 'insensitive' } }, { address: { contains: q, mode: 'insensitive' } }] }, take: 100 })
    return res.send({ commerces })
  } else {
    const users = await prisma.user.findMany({ where: { OR: [{ name: { contains: q, mode: 'insensitive' } }, { email: { contains: q, mode: 'insensitive' } }] }, take: 100 })
    return res.send({ users })
  }
}

export const promoteUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) return res.status(404).send({ error: 'user not found' })
  if (user.role === 'ADMIN') return res.status(400).send({ error: 'already admin' })
  const updated = await prisma.user.update({ where: { id }, data: { role: 'ADMIN' as any } })
  res.send({ id: updated.id, email: updated.email, role: updated.role })
}

export default { pendingPromotions, approvePromotion }
