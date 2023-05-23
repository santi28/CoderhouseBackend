import { Request, Response } from 'express'
import CartsDAO from '../dao/mongo/carts.dao'
import ProductsDAO from '../dao/mongo/products.dao'

const cartsDAO = new CartsDAO()
const productsDAO = new ProductsDAO()

// Obtiene el carrito del usuario logueado
export const getCart = async (req: Request, res: Response) => {
  const { id: userId } = req.user as any

  try {
    const cart = await cartsDAO.getCartByUser(userId)
    res.json(cart)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const addProductToCart = async (req: Request, res: Response) => {
  const { id: userId } = req.user as any
  const { productId, quantity } = req.body

  console.log(req.body)

  if (!productId || !quantity) {
    return res.status(400).json({ message: 'Faltan datos' })
  }

  try {
    const product = await productsDAO.findById(productId)

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' })
    }

    const cart = await cartsDAO.addProductToCart(userId, productId, quantity)
    res.status(201).json(cart)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const updateProductQuantity = async (req: Request, res: Response) => {
  const { id: userId } = req.user as any
  const { productId } = req.params
  const { quantity } = req.body

  if (!productId || !quantity) {
    return res.status(400).json({ message: 'Faltan datos' })
  }

  try {
    const product = await productsDAO.findById(productId)

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' })
    }

    const cart = await cartsDAO.updateProductQuantity(userId, productId, quantity)
    res.json(cart)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteProductFromCart = async (req: Request, res: Response) => {
  const { id: userId } = req.user as any
  const { productId } = req.params

  if (!productId) {
    return res.status(400).json({ message: 'Faltan datos' })
  }

  try {
    const product = await productsDAO.findById(productId)

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' })
    }

    const cart = await cartsDAO.deleteProductFromCart(userId, productId)
    res.json(cart)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteCart = async (req: Request, res: Response) => {
  const { id: userId } = req.user as any

  try {
    const cart = await cartsDAO.deleteCart(userId)
    res.json(cart)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
