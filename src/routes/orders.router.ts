import { Router } from 'express'
import expressAsyncHandler from 'express-async-handler'
import ordersController from '../controllers/orders.controller'

const router = Router()

router.post(
  '/',
  expressAsyncHandler(ordersController.createOrder)
)

router.get(
  '/',
  expressAsyncHandler(ordersController.getOrders)
)

router.get(
  '/:id',
  expressAsyncHandler(ordersController.getOrderById)
)

export default router
