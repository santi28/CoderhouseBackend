import mongoose from 'mongoose'
import config from './app.config'

export default async function connectToDatabase (): Promise<void> {
  const { db } = config

  try {
    // Evadimos el warning de mongoose por utilizar strictQuery
    mongoose.set('strictQuery', false)

    // Conectamos a la base de datos
    if (!db.username || !db.password) {
      if (!db.uri) throw new Error('❌ DB URI is required')
      console.log('ℹ️ Connecting to MongoDB with URI')
      await mongoose.connect(
        db.uri,
        {
          dbName: db.name
        }
      )
    } else {
      console.log('ℹ️ Connecting to MongoDB with credentials')

      await mongoose.connect(
        `mongodb://${db.host}:${db.port}`,
        {
          dbName: db.name,
          authSource: 'admin',
          user: db.username,
          pass: db.password
        }
      )
    }

    return console.log('✅ Connected to MongoDB database successfully')
  } catch (error) {
    console.error(error)
    console.error('❌ Error while trying to connect to MongoDB')
    return process.exit(1)
  }
}
