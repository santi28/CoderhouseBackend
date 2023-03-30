import { Router } from 'express'
import expressAsyncHandler from 'express-async-handler'

import orderModel from '../dao/mongo/order.dao'
import userModel from '../dao/mongo/user.dao'
import { sendEmail, sendSMS } from '../services/comunications.service'
import configurations from '../config/app.config'

const router = Router()

interface IProduct {
  _id: string
  name: string
  price: number
  quantity: number
}

router.post(
  '/',
  expressAsyncHandler(
    async (req, res): Promise<void> => {
      try {
        const { userId, products } = req.body

        const user = await userModel.findById(userId)

        const order = await orderModel.create({
          user: userId,
          products: products.map((product: any) => ({
            product: product._id,
            quantity: product.quantity
          })),
          total: products.reduce((acc: number, product: any) => acc + product.price * product.quantity, 0)
        })

        const gettedOrder = await orderModel.findById(order._id)
          .populate('user', '-password')
          .populate('products.product')

        if (!gettedOrder) { throw new Error('Order not found') }
        const productsList = gettedOrder.products as unknown as Array<{ product: IProduct, quantity: number }>

        // Envia un sms al usuario con el detalle de la orden y el estado de la misma
        await sendSMS(
          user?.phone as string,
          `
            Su orden ha sido recibida y está siendo procesada.
            Detalle de la orden (${gettedOrder._id.toString()}):
              ${productsList.map((product) => `
              Producto: ${product.product.name}
              Precio: ${product.product.price}
              Cantidad: ${product.quantity}
              -----------------
              `).join('')}
            Total: ${gettedOrder.total}
          `
        )

        // Envia un mail al administrador con el detalle de la orden y el estado de la misma
        await sendEmail(
          configurations.app.administrator.email,
          `Nueva orden recibida de ${user?.name as string}`,
          `
            <h1>Se ha recibido una nueva orden en la plataforma</h1>
            <p>Usuario: ${user?.name as string}</p>
            <p>Detalle de la orden (${gettedOrder._id.toString()}):
              ${productsList.map((product) => `
              <p>Producto: ${product.product.name}</p>
              <p>Precio: ${product.product.price}</p>
              <p>Cantidad: ${product.quantity}</p>
              <p>-----------------</p>
              `).join('')}
            <p>Total: ${gettedOrder.total}</p>
          `
        )

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
