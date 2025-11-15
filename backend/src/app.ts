import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import authRoutes from './routes/auth'
import usersRoutes from './routes/users'
import commercesRoutes from './routes/commerces'
import promotionsRoutes from './routes/promotions'
import couponsRoutes from './routes/coupons'
import adminRoutes from './routes/admin'
import { errorHandler } from './middlewares/errorHandler'

const app = express()
app.set('trust proxy', 1)
app.use(helmet())
app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }))
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/users', usersRoutes)
app.use('/commerces', commercesRoutes)
app.use('/promotions', promotionsRoutes)
app.use('/coupons', couponsRoutes)
app.use('/admin', adminRoutes)

app.get('/', (req, res) => res.send({ ok: true }))
app.get('/health', (req, res) => res.status(200).json({ ok: true, time: Date.now() }))

// Error handler (last middleware)
app.use(errorHandler)

export default app
