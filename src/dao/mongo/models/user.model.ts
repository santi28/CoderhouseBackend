import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  name: String,
  address: String,
  age: Number,
  phone: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'user' },
  avatar: { type: String, default: 'default.png' }
}, { timestamps: true })

export default mongoose.model('User', UserSchema)
