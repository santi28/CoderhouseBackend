// Modulos de terceros
import path from 'path'
import express from 'express'
import cookieParser from 'cookie-parser'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'

// Modulos de configuración
import config from './config/app.config'
import connectToDatabase from './config/mongodb.config'
import initializePassport from './config/passport.config'
import initTemplateEngine from './config/templateEnginge.config'

import typeDef from './schema.graphql'
import resolvers from './resolvers'

// Modulo de router
import routes from './routes/index.router'

void (async () => {
  const app = express()
  await connectToDatabase()

  const port = config.port

  // Inicializamos el motor de plantillas
  await initTemplateEngine(app)

  // Middlewares
  app.use(express.static(path.join(__dirname, 'public')))
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())
  app.use(cookieParser())

  // Inicializamos passport con la estrategia local y autenticación con JWT
  initializePassport()

  const apollo = new ApolloServer({
    typeDefs: typeDef,
    resolvers
  })

  await apollo.start()

  app.use(expressMiddleware(apollo))

  // Configuramos las rutas
  app.use('/', routes)

  app.listen(
    port,
    () => console.log(`🚀 Server running at http://localhost:${port}`)
  )
})()
