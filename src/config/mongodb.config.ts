import mongoose from 'mongoose'
import config from './app.config'

export default async function connectToDatabase (): Promise<void> {
  const { db } = config

  try {
    // Evadimos el warning de mongoose por utilizar strictQuery
    mongoose.set('strictQuery', false)

    // Conectamos a la base de datos
    await mongoose.connect(
      `mongodb://${db.host}:${db.port}`,
      {
        dbName: db.name,
        authSource: 'admin',
        user: db.username,
        pass: db.password
      }
    )

    return console.log('✅ Connected to MongoDB database successfully')
  } catch (error) {
    console.error('❌ Error while trying to connect to MongoDB')
    return process.exit(1)
  }
}
