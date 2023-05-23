import { Request, Response } from 'express'
import axios from 'axios'
import config from '../config/app.config'
import CartDAO from '../dao/mongo/carts.dao'

const cartDAO = new CartDAO()

export const home = async (req: Request, res: Response): Promise<void> => {
  // Obtenemos los productos
  const { data: products } = await axios.get(`http://${req.hostname}:${config.port}/api/products`)

  res.render('index', { session: req.user, products })
}

export const categories = async (req: Request, res: Response): Promise<void> => {
  const categories = {
    games: 'Videojuegos',
    consoles: 'Consolas'
  }

  const { id } = req.params
  const category = categories[id as keyof typeof categories]

  if (!category) {
    res.redirect('/')
    return
  }

  // Obtenemos los productos
  const { data: products } = await axios.get(`http://${req.hostname}:${config.port}/api/products?category=${id}`)

  res.render('category', { session: req.user, products, category })
}

export const product = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params

  try {
    const { data: product } = await axios.get(`http://${req.hostname}:${config.port}/api/products/${id}`)

    if (!product) {
      res.redirect('/')
      return
    }

    res.render('product', { session: req.user, product })
  } catch (error) {
    res.redirect('/')
  }
}

export const addProduct = (req: Request, res: Response): void => {
  res.render('products/add', { session: req.user })
}

export const confirmOrder = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.user as any
  console.log(id)

  const cart = await cartDAO.getCartByUser(id)

  if (!cart || cart.products.length === 0) {
    res.redirect('/')
    return
  }

  const jsonCart = cart.toJSON()

  let subtotal = 0

  // Agregamos el total de cada producto
  jsonCart.products = jsonCart.products.map((product: any) => {
    product.total = product.product.price * product.quantity
    subtotal += product.total as number
    return product
  })

  res.render('orders/confirm', { session: req.user, cart: jsonCart, subtotal })
}

export const placedOrder = async (req: Request, res: Response): Promise<void> => {
  res.render('orders/placed', { session: req.user })
}

export const register = (req: Request, res: Response): void => {
  res.render('register')
}

export const login = (req: Request, res: Response): void => {
  res.render('login')
}

export const logout = (req: Request, res: Response): void => {
  res.clearCookie(config.app.jwt.cookie)
  res.render('logout')
}

export const order = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params

  const { data: order } = await axios.get(`http://${req.hostname}:${config.port}/api/orders/${id}`)
  res.render('order', { session: req.user, order })
}
