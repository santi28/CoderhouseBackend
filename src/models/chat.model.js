import { Schema, model } from 'mongoose'

export const messageSchema = new Schema({
  author: {
    id: { type: String, required: true },
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    alias: { type: String, required: true },
    edad: { type: Number, required: true },
    avatar: { type: String, required: true }
  },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
})

export default model('Message', messageSchema)
