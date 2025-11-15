import { Router } from 'express'
import { handleAsync } from '../utils/handleAsync'
import * as promotionCtrl from '../controllers/promotionController'
import { requireAuth } from '../middlewares/authMiddleware'

const router = Router()

router.post('/', requireAuth, handleAsync(promotionCtrl.createPromotion))
router.get('/', handleAsync(promotionCtrl.listPromotions))
router.get('/nearby', handleAsync(promotionCtrl.nearbyPromotions))
router.get('/:id', handleAsync(promotionCtrl.getPromotion))
router.patch('/:id', requireAuth, handleAsync(promotionCtrl.updatePromotion))
router.post('/:id/pause', requireAuth, handleAsync(promotionCtrl.pausePromotion))
router.post('/:id/activate', requireAuth, handleAsync(promotionCtrl.activatePromotion))

export default router
