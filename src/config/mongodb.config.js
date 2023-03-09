import mongoose from 'mongoose'
import config from './app.config.js'

export const initMongoDB = () => {
  mongoose.set('strictQuery', false)
  mongoose
    .connect(config.db.uri, {
      dbName: config.db.name,
      authSource: 'admin',
      user: config.db.user,
      pass: config.db.password
    })
    .then(() => console.log('🟢 Connected to MongoDB'))
    .catch((error) =>
      console.error('🔴 Error when attempting to connect', error)
    )
}

export default initMongoDB
