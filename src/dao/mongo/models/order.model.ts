import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  orderNumber: { type: Number, required: true },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 }
    }
  ],
  total: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  address: { type: String, required: true }
}, { timestamps: true })

export default mongoose.model('Order', ProductSchema)
