import passport from 'passport'
import { Router } from 'express'
import expressAsyncHandler from 'express-async-handler'

import uploader from '../utils/multer.helper'
import accountsController from '../controllers/accounts.controller'

const router = Router()

router.post(
  '/register',
  uploader.single('profileImage'),
  expressAsyncHandler(accountsController.register)
)

router.post(
  '/login',
  passport.authenticate('login', { session: false }),
  expressAsyncHandler(accountsController.login)
)

export default router
