import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt, { type SignOptions, type Secret } from 'jsonwebtoken'
import prisma from '../lib/prisma'
import { registerSchema, loginSchema } from '../validators/authValidators'

const ACCESS_EXP_STR = process.env.ACCESS_TOKEN_EXP || '15m'
const REFRESH_EXP_STR = process.env.REFRESH_TOKEN_EXP || '30d'
const ACCESS_SECRET: Secret = process.env.JWT_SECRET || 'secret'
const REFRESH_SECRET: Secret = process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET || 'refresh_secret'

function signAccess(user: any) {
  const options: SignOptions = { expiresIn: ACCESS_EXP_STR as any }
  return jwt.sign({ userId: user.id, role: user.role }, ACCESS_SECRET, options)
}

function signRefresh(user: any) {
  const options: SignOptions = { expiresIn: REFRESH_EXP_STR as any }
  return jwt.sign({ userId: user.id }, REFRESH_SECRET, options)
}

export const register = async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).send({ error: parsed.error.message })
  const { name, email, password, role } = parsed.data
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return res.status(400).send({ error: 'Email already registered' })
  const hash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({ data: { name, email, passwordHash: hash, role: (role ? role.toUpperCase() : 'USER') as any } })

  const accessToken = signAccess(user)
  const refreshToken = signRefresh(user)

  // persist refresh token
  const expiresAt = new Date(Date.now() + parseRefreshExpMs(REFRESH_EXP_STR))
  await prisma.refreshToken.create({ data: { token: refreshToken, userId: user.id, expiresAt } })

  res.send({ user: { id: user.id, email: user.email, name: user.name, role: user.role }, accessToken, refreshToken })
}

export const login = async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).send({ error: parsed.error.message })
  const { email, password } = parsed.data
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return res.status(401).send({ error: 'invalid credentials' })
  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return res.status(401).send({ error: 'invalid credentials' })

  const accessToken = signAccess(user)
  const refreshToken = signRefresh(user)
  const expiresAt = new Date(Date.now() + parseRefreshExpMs(REFRESH_EXP_STR))
  await prisma.refreshToken.create({ data: { token: refreshToken, userId: user.id, expiresAt } })

  res.send({ accessToken, refreshToken })
}

export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.body
  if (!refreshToken) return res.status(400).send({ error: 'missing refreshToken' })
  try {
    const payload: any = jwt.verify(refreshToken, REFRESH_SECRET)
    const record = await prisma.refreshToken.findUnique({ where: { token: refreshToken } })
    if (!record || record.revoked) return res.status(401).send({ error: 'invalid refresh token' })
    if (new Date(record.expiresAt) < new Date()) return res.status(401).send({ error: 'refresh token expired' })

    const user = await prisma.user.findUnique({ where: { id: payload.userId } })
    if (!user) return res.status(404).send({ error: 'user not found' })

    // rotate refresh token
    await prisma.refreshToken.update({ where: { id: record.id }, data: { revoked: true } })
    const newRefresh = signRefresh(user)
    const expiresAt = new Date(Date.now() + parseRefreshExpMs(REFRESH_EXP_STR))
    await prisma.refreshToken.create({ data: { token: newRefresh, userId: user.id, expiresAt } })

    const accessToken = signAccess(user)
    res.send({ accessToken, refreshToken: newRefresh })
  } catch (err) {
    return res.status(401).send({ error: 'invalid refresh token' })
  }
}

export const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.body
  if (!refreshToken) return res.status(400).send({ error: 'missing refreshToken' })
  await prisma.refreshToken.updateMany({ where: { token: refreshToken }, data: { revoked: true } })
  res.send({ ok: true })
}

export const me = async (req: Request, res: Response) => {
  const user = (req as any).user
  if (!user) return res.status(401).send({ error: 'unauthorized' })
  // fetch full user to include role and name
  const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
  if (!dbUser) return res.status(404).send({ error: 'user not found' })
  res.send({ id: dbUser.id, email: dbUser.email, name: dbUser.name, role: dbUser.role })
}

function parseRefreshExpMs(exp: string) {
  // simple parser for values like '30d', '15m'
  if (exp.endsWith('d')) {
    const n = Number(exp.slice(0, -1))
    return n * 24 * 60 * 60 * 1000
  }
  if (exp.endsWith('h')) {
    const n = Number(exp.slice(0, -1))
    return n * 60 * 60 * 1000
  }
  if (exp.endsWith('m')) {
    const n = Number(exp.slice(0, -1))
    return n * 60 * 1000
  }
  return 30 * 24 * 60 * 60 * 1000
}

export default { register, login, refresh, logout }
