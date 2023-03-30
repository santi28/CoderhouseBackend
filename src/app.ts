import express from 'express'
import connectToDatabase from './config/mongodb.config'
import configurations from './config/app.config'
import routes from './routes/index.router'
import initTemplateEngine from './config/templateEnginge.config'
import path from 'path'

void (async () => {
  const app = express() // Initializamos el servidor
  await connectToDatabase() // Conectamos a la base de datos

  const port = configurations.port // Obtenemos el puerto de la configuración

  await initTemplateEngine(app) // Inicializamos el motor de plantillas
  app.use(express.static(path.join(__dirname, 'public'))) // Configura el directorio público
  app.use(express.json()) // Configura el body parser para json
  app.use(express.urlencoded({ extended: true })) // Configura el body parser para formularios
  app.use('/', routes) // Configuramos las rutas

  // Iniciamos el servidor
  app.listen(
    port,
    () => console.log(`🚀 Server running at http://localhost:${port}`)
  )
})()
