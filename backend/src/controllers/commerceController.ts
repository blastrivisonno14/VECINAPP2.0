import { Request, Response } from 'express'
import prisma from '../lib/prisma'
import { createCommerceSchema, updateCommerceSchema } from '../validators/commerceValidators'

export const createCommerce = async (req: Request, res: Response) => {
  const parsed = createCommerceSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).send({ error: parsed.error.message })
  // ownerId should be the authenticated user (assume middleware sets req.user)
  const ownerId = (req as any).user?.id
  if (!ownerId) return res.status(401).send({ error: 'unauthorized' })
  // prevent multiple commerces per owner
  const existingForOwner = await prisma.commerce.findFirst({ where: { ownerId } })
  if (existingForOwner) return res.status(409).send({ error: 'owner already has a commerce', commerceId: existingForOwner.id })
  const data = { ...parsed.data, ownerId }
  const commerce = await prisma.commerce.create({ data })
  res.status(201).send(commerce)
}

export const getCommerce = async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const commerce = await prisma.commerce.findUnique({ where: { id }, include: { promotions: true } })
  if (!commerce) return res.status(404).send({ error: 'not found' })
  res.send(commerce)
}

export const listCommerces = async (req: Request, res: Response) => {
  const commerces = await prisma.commerce.findMany({ take: 100 })
  res.send(commerces)
}

export const myCommerce = async (req: Request, res: Response) => {
  const ownerId = (req as any).user?.id
  if (!ownerId) return res.status(401).send({ error: 'unauthorized' })
  const commerce = await prisma.commerce.findFirst({ where: { ownerId } })
  if (!commerce) return res.status(404).send({ error: 'not found' })
  res.send(commerce)
}

export const updateCommerce = async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const parsed = updateCommerceSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).send({ error: parsed.error.message })
  const existing = await prisma.commerce.findUnique({ where: { id } })
  if (!existing) return res.status(404).send({ error: 'not found' })
  // Only owner or admin can update
  const user = (req as any).user
  if (user?.id !== existing.ownerId && user?.role !== 'ADMIN') return res.status(403).send({ error: 'forbidden' })
  const updated = await prisma.commerce.update({ where: { id }, data: parsed.data })
  res.send(updated)
}

export default { createCommerce, getCommerce, listCommerces, updateCommerce, myCommerce }
