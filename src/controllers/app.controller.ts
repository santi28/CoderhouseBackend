import { Request, Response } from 'express'
import axios from 'axios'
import config from '../config/app.config'

export const home = async (req: Request, res: Response): Promise<void> => {
  const { data: products } = await axios.get(`http://${req.hostname}:${config.port}/api/products`)
  res.render('index', { session: req.user, products })
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

export const addProduct = (req: Request, res: Response): void => {
  res.render('products/add', { session: req.user })
}

export const order = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params

  const { data: order } = await axios.get(`http://${req.hostname}:${config.port}/api/orders/${id}`)
  res.render('order', { session: req.user, order })
}

export default {
  home,
  register,
  login,
  logout,
  addProduct,
  order
}
