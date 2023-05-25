import { Schema, model } from 'mongoose'

export const ProductSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, min: 1, required: true },
  category: { type: String, required: true },
  images: [{ type: String, required: true }],
  slug: { type: String, required: true, unique: true }
}, {
  timestamps: true
})

export default model('Product', ProductSchema)
