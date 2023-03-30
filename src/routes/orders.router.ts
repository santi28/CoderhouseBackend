import { Router } from 'express'
import expressAsyncHandler from 'express-async-handler'

import orderModel from '../dao/mongo/order.dao'

const router = Router()

router.post(
  '/',
  expressAsyncHandler(
    async (req, res): Promise<void> => {
      try {
        const { userId, products } = req.body

        const order = await orderModel.create({
          user: userId,
          products: products.map((product: any) => ({
            product: product._id,
            quantity: product.quantity
          })),
          total: products.reduce((acc: number, product: any) => acc + product.price * product.quantity, 0)
        })

        res.status(201).json(order)
      } catch (error) {
        console.error(error)
        res.status(500).json({ error: 500, message: 'Internal server error' })
      }
    }
  )
)

router.get(
  '/',
  expressAsyncHandler(
    async (req, res): Promise<void> => {
      try {
        const orders = await orderModel.find()
          .populate('user', '-password')
          .populate('products.product')

        res.status(200).json(orders)
      } catch (error) {
        console.error(error)
        res.status(500).json({ error: 500, message: 'Internal server error' })
      }
    }
  )
)

router.get(
  '/:id',
  expressAsyncHandler(
    async (req, res): Promise<void> => {
      try {
        const { id } = req.params

        const order = await orderModel.findById(id)
          .populate('user', '-password')
          .populate('products.product')

        res.status(200).json(order)
      } catch (error) {
        console.error(error)
        res.status(500).json({ error: 500, message: 'Internal server error' })
      }
    }
  )
)

export default router
