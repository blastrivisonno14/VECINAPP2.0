import { Router } from 'express'
import { handleAsync } from '../utils/handleAsync'
import * as couponCtrl from '../controllers/couponController'
import { requireAuth } from '../middlewares/authMiddleware'

const router = Router()

router.post('/:promotionId/create', requireAuth, handleAsync(couponCtrl.createCoupon))
router.post('/:id/redeem', requireAuth, handleAsync(couponCtrl.redeemCoupon))
router.post('/validate', requireAuth, handleAsync(couponCtrl.validateQRCode))
router.get('/me', requireAuth, handleAsync(couponCtrl.myCoupons))

export default router
