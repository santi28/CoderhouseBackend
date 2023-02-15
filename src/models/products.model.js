import { Schema, model } from 'mongoose'

export const productSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  code: { type: String, required: true },
  picture: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
})

export default model('Product', productSchema)
