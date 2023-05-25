import CartModel from './models/cart.model'
import { Types } from 'mongoose'

export default class CartDAO {
  async getAllCarts () {
    try {
      const carts = await CartModel.find()
        .populate('user')
        .populate('products.product')

      return carts
    } catch (error) {
      throw new Error('Error al obtener los carritos')
    }
  }

  async getCartByUser (userId: string) {
    try {
      const cart = await CartModel.findOne({ user: userId })
        .populate('user')
        .populate('products.product')

      return cart
    } catch (error) {
      throw new Error('Error al obtener el carrito del usuario')
    }
  }

  async addProductToCart (userId: string, productId: string, quantity: number) {
    try {
      // Obtenemos el carrito del usuario (si existe)
      const cart = await CartModel.findOne({ user: userId })

      if (cart) {
        // Si el carrito ya existe, verificamos que el producto no exista
        const isProductInCart = cart.products.some((item) => item.product._id.toString() === productId)

        if (isProductInCart) {
          // Si el producto existe en el carrito, actualizamos la cantidad
          cart.products = cart.products.map((item) => {
            if (item.product._id.toString() === productId) {
              item.quantity += quantity
            }
            return item
          })

          return await cart.save()
        }

        // Si el producto no existe en el carrito, lo agregamos
        cart.products.push({ product: new Types.ObjectId(productId), quantity })
        return await cart.save()
      } else {
        return await CartModel.create({
          user: userId,
          products: [{ product: new Types.ObjectId(productId), quantity }]
        })
      }
    } catch (error: any) {
      throw new Error(error)
    }
  }

  async updateProductQuantity (userId: string, productId: string, quantity: number) {
    try {
      const cart = await CartModel.findOne({ user: userId })

      if (!cart) {
        throw new Error('Carrito no encontrado')
      }

      cart.products = cart.products.map((item) => {
        if (item.product._id.toString() === productId) {
          item.quantity = quantity
        }
        return item
      })

      return await cart.save()
    } catch (error: any) {
      throw new Error(error)
    }
  }

  async deleteProductFromCart (userId: string, productId: string) {
    try {
      const cart = await CartModel.findOne({ user: userId })

      if (!cart) {
        throw new Error('Carrito no encontrado')
      }

      cart.products = cart.products.filter((item) => item.product._id.toString() !== productId)

      return await cart.save()
    } catch (error: any) {
      throw new Error(error)
    }
  }

  async deleteCart (userId: string) {
    try {
      const cart = await CartModel.findOne({ user: userId })

      if (!cart) {
        throw new Error('Carrito no encontrado')
      }

      cart.products = []
      return await cart.save()
    } catch (error: any) {
      throw new Error(error)
    }
  }
}
