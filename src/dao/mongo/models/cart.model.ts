import { Schema, model } from 'mongoose'

export const CartSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, min: 1, required: true }
  }]
}, {
  timestamps: true
})

export default model('Cart', CartSchema)
