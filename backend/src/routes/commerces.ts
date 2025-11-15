import { Router } from 'express'
import { handleAsync } from '../utils/handleAsync'
import * as commerceCtrl from '../controllers/commerceController'
import { requireAuth } from '../middlewares/authMiddleware'

const router = Router()

router.post('/', requireAuth, handleAsync(commerceCtrl.createCommerce))
router.get('/', handleAsync(commerceCtrl.listCommerces))
router.get('/mine', requireAuth, handleAsync(commerceCtrl.myCommerce))
router.get('/:id', handleAsync(commerceCtrl.getCommerce))
router.patch('/:id', requireAuth, handleAsync(commerceCtrl.updateCommerce))

export default router
