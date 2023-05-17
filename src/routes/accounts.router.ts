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

router.get(
  '/forgot-password',
  expressAsyncHandler(accountsController.forgotPassword)
)

export default router
