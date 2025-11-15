import { Router } from 'express'
import prisma from '../lib/prisma'
import { requireAuth } from '../middlewares/authMiddleware'

const router = Router()

router.get('/me', requireAuth, async (req: any, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } })
  if (!user) return res.status(404).send({ error: 'not found' })
  res.send(user)
})

export default router
