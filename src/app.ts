// Modulos de terceros
import path from 'path'
import express from 'express'
import cookieParser from 'cookie-parser'

// Modulos de configuración
import config from './config/app.config'
import connectToDatabase from './config/mongodb.config'
import initializePassport from './config/passport.config'
import initTemplateEngine from './config/templateEnginge.config'

// Modulo de router
import routes from './routes/index.router'
import cors from 'cors'

void (async () => {
  const app = express()
  await connectToDatabase()

  const port = config.port

  // Inicializamos el motor de plantillas
  await initTemplateEngine(app)

  // Middlewares
  app.use(cors())
  app.use(express.static(path.join(__dirname, 'public')))
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())
  app.use(cookieParser())

  // Inicializamos passport con la estrategia local y autenticación con JWT
  initializePassport()

  // Configuramos las rutas
  app.use('/', routes)

  app.listen(
    port,
    () => console.log(`🚀 Server running at http://localhost:${port}`)
  )
})()
