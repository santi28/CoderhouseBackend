import mongoose from 'mongoose'

export const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, default: 'placeholder.webp' }
}, { timestamps: true })

export default mongoose.model('Product', ProductSchema)
