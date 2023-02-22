import http from 'http'
import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'

// Import of initializers
import { initMongoDB } from './config/mongodb.config.js'
import { initWebscoketServer } from './websocket/app.js'
import { initHandlebars } from './config/templateEnginge.config.js'
import { initSessions } from './config/sessions.config.js'

import Router from './router/index.router.js'

const app = express() // Inicializa el servidor express
const server = http.createServer(app) // Inicializa el servidor http
const PORT = process.env.PORT || 3000 // Configura el puerto, si no existe usa el 3000

dotenv.config() // Inicializa las variables de entorno
app.use(morgan('dev')) // Inicializa el logger utilizando morgan
app.use(express.static('./src/public')) // Configura la carpeta de estaticos

initMongoDB() // Inicializa la conexion a la base de datos
initWebscoketServer(server) // Inicializa el servidor de websockets
initHandlebars(app) // Inicializa el motor de plantillas
initSessions(app) // Inicializa las sesiones

app.use(express.json()) // Configura el body parser para json
app.use(express.urlencoded({ extended: true })) // Configura el body parser para formularios

app.use(Router) // Configura el enrutador

server.listen(
  PORT,
  console.log(`🚀 Server running on url http://localhost:${PORT}`)
)
