import passport from 'passport'
import { Router } from 'express'
import expressAsyncHandler from 'express-async-handler'

import uploader from '../utils/multer.helper'
import * as accountsController from '../controllers/accounts.controller'

const router = Router()

router.post(
  '/register',
  uploader.single('avatar'),
  expressAsyncHandler(accountsController.register)
)

router.post(
  '/login',
  passport.authenticate('login', { session: false }),
  expressAsyncHandler(accountsController.login)
)

router.post(
  '/forgot-password',
  expressAsyncHandler(accountsController.forgotPassword)
)

router.put(
  '/reset-password',
  expressAsyncHandler(accountsController.resetPasswordByRecoveryCode)
)

export default router
