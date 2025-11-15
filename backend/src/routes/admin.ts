import { Router } from 'express'
import { handleAsync } from '../utils/handleAsync'
import * as adminCtrl from '../controllers/adminController'
import { requireAuth, requireAdmin } from '../middlewares/authMiddleware'

const router = Router()

router.get('/promotions/pending', requireAuth, requireAdmin, handleAsync(adminCtrl.pendingPromotions))
router.patch('/promotions/:id/approve', requireAuth, requireAdmin, handleAsync(adminCtrl.approvePromotion))
router.delete('/promotions/:id', requireAuth, requireAdmin, handleAsync(adminCtrl.deletePromotionAdmin))

router.patch('/commerces/:id/activate', requireAuth, requireAdmin, handleAsync(adminCtrl.activateCommerce))
router.patch('/commerces/:id/deactivate', requireAuth, requireAdmin, handleAsync(adminCtrl.deactivateCommerce))

router.get('/stats', requireAuth, requireAdmin, handleAsync(adminCtrl.stats))
router.get('/search', requireAuth, requireAdmin, handleAsync(adminCtrl.search))

export default router
