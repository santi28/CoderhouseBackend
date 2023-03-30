import express from 'express'
import connectToDatabase from './config/mongodb.config'
import configurations from './config/app.config'
import routes from './routes/index.router'
import initTemplateEngine from './config/templateEnginge.config'
import path from 'path'
import initializePassport from './config/passport.config'
import cookieParser from 'cookie-parser'

void (async () => {
  const app = express() // Initializamos el servidor
  await connectToDatabase() // Conectamos a la base de datos

  const port = configurations.port

  // Inicializamos el motor de plantillas
  await initTemplateEngine(app)

  // Middlewares
  app.use(express.static(path.join(__dirname, 'public')))
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(cookieParser())

  // Inicializamos passport con la estrategia local y autenticación con JWT
  initializePassport()

  // Configuramos las rutas
  app.use('/', routes)

  // Iniciamos el servidor
  app.listen(
    port,
    () => console.log(`🚀 Server running at http://localhost:${port}`)
  )
})()
