import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, lowercase: true, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  avatar: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  recoveryCode: { type: String },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  deleted: { type: Boolean, default: false }
}, { timestamps: true })

export default mongoose.model('User', UserSchema)
