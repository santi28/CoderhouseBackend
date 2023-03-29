import express, { } from 'express'
import connectToDatabase from './config/mongodb.config'
import configurations from './config/app.config'

void (async () => {
  // Conectamos a la base de datos
  await connectToDatabase()

  // Inicializamos la aplicación
  const app = express()

  // Definimos el puerto de escucha
  const port = configurations.port

  // Iniciamos el servidor
  app.listen(
    port,
    () => console.log(`🚀 Server running at http://localhost:${port}`)
  )
})()
