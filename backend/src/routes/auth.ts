import { Router } from 'express'
import { handleAsync } from '../utils/handleAsync'
import * as authCtrl from '../controllers/authController'

const router = Router()

router.post('/register', handleAsync(authCtrl.register))
router.post('/login', handleAsync(authCtrl.login))
router.post('/refresh', handleAsync(authCtrl.refresh))
router.post('/logout', handleAsync(authCtrl.logout))

export default router
