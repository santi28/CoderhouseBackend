import { Router } from 'express'
import { executePolicy } from '../middlewares/authenticate.middleware'
import expressAsyncHandler from 'express-async-handler'
import appController from '../controllers/app.controller'

const router = Router()

router.get(
  '/', executePolicy(['AUTHENTICATED']),
  expressAsyncHandler(appController.home)
)

router.get(
  '/register',
  appController.register
)

router.get(
  '/login',
  appController.login
)

router.get(
  '/logout',
  appController.logout
)

router.get(
  'products/add',
  executePolicy(['AUTHENTICATED']),
  appController.addProduct
)

router.get(
  '/orders/:id',
  executePolicy(['AUTHENTICATED']),
  expressAsyncHandler(appController.order)
)

export default router
