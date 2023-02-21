/* eslint-disable import/first */
// Inicializa las configuraciones del entorno
import dotenv from 'dotenv'
dotenv.config()

import path from 'path'
import http from 'http'
import { fileURLToPath } from 'url'

import express from 'express'
import handlebars from 'express-handlebars'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import { Server } from 'socket.io'

import { mongodb } from './config/index.js'

// DAO Import
import { ChatsDAO } from './daos/chats/chats.mongo.dao.js'
import { ProductsDAO } from './daos/products/products.mongo.dao.js'

import { normalize } from 'normalizr'
import { messageSchema } from './schemas/messages.schema.js'

// Router Import
import appRouter from './router/app.router.js'
import productsRouter from './router/products.router.js'
import sessionRouter from './router/session.router.js'
import cartsRouter from './router/cart.router.js'

const app = express()
const server = http.createServer(app)
const io = new Server(server)
mongodb() // Inicializa la conexión a MongoDB

const PORT = process.env.PORT || 3000
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      mongoOptions: {
        authSource: 'admin',
        auth: {
          username: process.env.MONGO_USER,
          password: process.env.MONGO_PASS
        }
      },
      dbName: process.env.MONGO_DB,
      ttl: 60 * 1 // 10 minutes
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
)

const chatContainer = new ChatsDAO()
const productsContainer = new ProductsDAO()

// Configuración de handlebars
app.engine(
  'hbs',
  handlebars.engine({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials')
  })
)

app.set('view engine', 'hbs')
app.set('views', './src/views')

// Static files
app.use(express.static('./src/public'))

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/', appRouter)
app.use('/api/products', productsRouter)
app.use('/api/cart', cartsRouter)
app.use('/api/accounts', sessionRouter)

// Websockets
io.on('connection', async (socket) => {
  console.log('👨‍🚀 New client connected')

  const productos = await productsContainer.getAll()
  socket.emit('productos', productos)

  const messages = await chatContainer.getAll()
  const normalizedMessages = normalize(messages, [messageSchema])

  socket.emit('messages', normalizedMessages)

  socket.on('new-product', async (data) => {
    try {
      const productCode = `${data.name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()}${Math.floor(Math.random() * 10000)}`

      const productId = await productsContainer.save({
        description: data.name,
        code: productCode,
        stock: 10,
        ...data
      })
      const product = await productsContainer.getById(productId)

      io.sockets.emit('update-products', product)
    } catch (error) {
      console.error(error)
    }
  })

  socket.on('new-message', async (messagePayload) => {
    const message = await chatContainer.save(messagePayload)
    // const chatMessage = await chatContainer.getById(messageId)
    io.sockets.emit('update-messages', message)
  })

  socket.on('disconnect', () => console.log('🚀 Client disconnected'))
})

server.listen(
  PORT,
  console.log(`🚀 Server running on url http://localhost:${PORT}`)
)
