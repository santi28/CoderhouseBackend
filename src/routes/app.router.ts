import { Router } from 'express'
import { executeFrontendPolicy } from '../middlewares/authenticate.middleware'
import * as appController from '../controllers/app.controller'

const router = Router()

router.get(
  '/', executeFrontendPolicy(['AUTHENTICATED']),
  appController.home
)

router.get(
  '/categories/:id',
  executeFrontendPolicy(['AUTHENTICATED']),
  appController.categories
)

router.get(
  '/products/add',
  executeFrontendPolicy(['admin']),
  appController.addProduct
)

router.get(
  '/products/:id',
  executeFrontendPolicy(['AUTHENTICATED']),
  appController.product
)

router.get(
  '/orders/confirm',
  executeFrontendPolicy(['AUTHENTICATED']),
  appController.confirmOrder
)

router.get(
  '/orders/placed',
  executeFrontendPolicy(['AUTHENTICATED']),
  appController.placedOrder
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
  executeFrontendPolicy(['AUTHENTICATED']),
  appController.addProduct
)

router.get(
  '/orders/:id',
  executeFrontendPolicy(['AUTHENTICATED']),
  appController.order
)

export default router
