import { Router } from 'express'
import * as ordersController from '../controllers/orders.controller'
import { executePolicy } from '../middlewares/authenticate.middleware'

const router = Router()

router.post(
  '/',
  executePolicy(['AUTHENTICATED']),
  ordersController.createOrder
)

// router.get(
//   '/',
//   expressAsyncHandler(ordersController.getOrders)
// )

// router.get(
//   '/:id',
//   expressAsyncHandler(ordersController.getOrderById)
// )

export default router
