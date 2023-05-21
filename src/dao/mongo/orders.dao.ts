import { Document } from 'mongoose'
import OrderModel from './models/order.model'

export interface Order {
  user: string
  orderNumber: number
  products: Array<{
    product: string
    quantity: number
  }>
  total: number
  status: 'pending' | 'completed'
  address: string
}

export type OrderDocument = Order & Document

export default class ProductsDAO {
  public async create (product: Order) {
    const newProduct = new OrderModel(product)
    return await newProduct.save()
  }

  public async findAll () {
    return await OrderModel.find()
  }

  public async findAllByUser (user: string) {
    return await OrderModel.find({ user })
  }

  public async findById (id: string) {
    return await OrderModel.findById(id)
  }
}
