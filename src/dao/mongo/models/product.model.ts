import { Schema, model } from 'mongoose'

export const ProductSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, default: 0 },
  images: { type: Array, default: [] },
  tags: { type: Array, default: [] }
}, {
  timestamps: true
})

export default model('Product', ProductSchema)
