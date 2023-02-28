import mongoose from 'mongoose'

export const initMongoDB = () => {
  mongoose.set('strictQuery', false)
  mongoose
    .connect(process.env.MONGO_URL, {
      dbName: process.env.MONGO_DB,
      authSource: 'admin',
      user: process.env.MONGO_USER,
      pass: process.env.MONGO_PASS
    })
    .then(() => console.log('🟢 Connected to MongoDB'))
    .catch((error) =>
      console.error('🔴 Error when attempting to connect', error)
    )
}

export default initMongoDB
