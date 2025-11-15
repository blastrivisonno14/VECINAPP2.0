import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma'

export interface AuthRequest extends Request {
  user?: any
}

const ACCESS_SECRET = process.env.JWT_SECRET || 'secret'

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const auth = req.headers.authorization
    if (!auth) return res.status(401).send({ error: 'missing auth' })
    const parts = auth.split(' ')
    if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).send({ error: 'invalid auth format' })
    const token = parts[1]
    const payload: any = jwt.verify(token, ACCESS_SECRET)
    if (!payload?.userId) return res.status(401).send({ error: 'invalid token' })
    const user = await prisma.user.findUnique({ where: { id: payload.userId } })
    if (!user) return res.status(401).send({ error: 'user not found' })
    req.user = { id: user.id, role: user.role, name: user.name }
    next()
  } catch (err) {
    return res.status(401).send({ error: 'unauthorized' })
  }
}

export function requireCommerce(req: AuthRequest, res: Response, next: NextFunction) {
  const role = String(req.user?.role || '').toLowerCase()
  if (role === 'commerce' || role === 'admin') return next()
  return res.status(403).send({ error: 'forbidden' })
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  const role = String(req.user?.role || '').toLowerCase()
  if (role === 'admin') return next()
  return res.status(403).send({ error: 'forbidden' })
}

export default requireAuth
