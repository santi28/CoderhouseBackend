import { Schema, model } from 'mongoose'
import { productSchema } from './products.model'

export const cartSchema = new Schema({
  products: { type: [productSchema], required: true },
  timestamp: { type: Date, default: Date.now }
})

export default model('Cart', cartSchema)
