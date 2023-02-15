/* eslint-disable import/first */
// Inicializa las configuraciones del entorno
import dotenv from 'dotenv'
dotenv.config()

import path from 'path'
import http from 'http'
import { fileURLToPath } from 'url'

import express, { Router } from 'express'
import handlebars from 'express-handlebars'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import { Server } from 'socket.io'
import { faker } from '@faker-js/faker/locale/es'

import { mongodb } from './config/index.js'

// DAO Import
import { CartsDAO, ProductsDAO, ChatsDAO } from './daos/index.js'
import { normalize } from 'normalizr'
import { messageSchema } from './schemas/messages.schema.js'

// Router Import
import appRouter from './router/app.router.js'
import sessionRouter from './router/session.router.js'

const app = express()
const server = http.createServer(app)
const io = new Server(server)
mongodb() // Inicializa la conexión a MongoDB

const PORT = process.env.PORT || 3000
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const authMiddleware = (req, res, next) => {
  const { administrator } = req.headers

  if (administrator) return next()
  return res.status(401).json({ error: 401, message: 'Unauthorized' })
}

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
      ttl: 60 // 1 minuto
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
)

const productsContainer = new ProductsDAO()
const cartContainer = new CartsDAO()
const chatContainer = new ChatsDAO()

const productsRouter = Router()
const cartRouter = Router()

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
app.use('/api/cart', cartRouter)
app.use('/api/accounts', sessionRouter)

// #region Products Router
productsRouter.get('/test', async (req, res) => {
  const fakerData = () => ({
    id: faker.datatype.uuid(),
    picture: faker.image.imageUrl(),
    code: faker.random.alphaNumeric(10),
    name: faker.commerce.productName(),
    price: faker.commerce.price(),
    stock: faker.random.numeric(),
    description: faker.commerce.productDescription()
  })

  const products = []

  // Agrega 5 productos
  for (let i = 0; i < 5; i++) products.push(fakerData())

  res.json(products)
})

productsRouter.get('/:id?', async (req, res) => {
  const { id } = req.params

  if (id) {
    const product = await productsContainer.getById(id)
    if (!product)
      return res.status(404).json({ error: 404, message: 'Product not found' })

    return res.json(product)
  } else {
    const products = await productsContainer.getAll()
    return res.json(products)
  }
})

productsRouter.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description, code, picture, price, stock } = req.body

    if (!name || !description || !code || !picture || !price || !stock)
      return res.status(400).json({
        error: 400,
        message: 'Mandatory fileds are missing'
      })

    const newProduct = { name, description, code, picture, price, stock }

    const newProductId = await productsContainer.save(newProduct)
    const product = await productsContainer.getById(newProductId)

    return res.status(201).json(product)
  } catch (error) {
    console.error(error)

    return res
      .status(500)
      .json({ error: 500, message: 'Internal server error' })
  }
})

productsRouter.put('/:id', async (req, res) => {
  const { id } = req.params
  const { name, description, code, picture, price, stock } = req.body
  const productBody = { name, description, code, picture, price, stock }

  try {
    const productId = await productsContainer.updateById(+id, productBody)
    const product = await productsContainer.getById(productId)

    return res.json(product)
  } catch (err) {
    return res
      .status(500)
      .json({ error: 500, message: 'Internal server error' })
  }
})

productsRouter.delete('/:id', async (req, res) => {
  const { id } = req.params
  await productsContainer.deleteById(+id)

  return res.status(204).end()
})
// #endregion

// #region Cart Router
cartRouter.post('/', async (req, res) => {
  const cartId = await cartContainer.save({
    products: [],
    createdAt: Date.now(),
    updatedAt: Date.now()
  })

  return res.status(201).json({ cartId })
})

cartRouter.delete('/:id', async (req, res) => {
  const { id } = req.params

  await cartContainer.deleteById(+id)

  return res.status(204).end()
})

cartRouter.get('/:id/products', async (req, res) => {
  const { id } = req.params

  const cart = await cartContainer.getById(id)

  if (!cart)
    return res.status(404).json({ error: 404, message: 'Cart not found' })

  return res.json(cart.products)
})

cartRouter.post('/:id/products', async (req, res) => {
  const { id } = req.params
  const { productId } = req.body

  const product = await productsContainer.getById(productId)

  if (!product)
    return res.status(404).json({ error: 404, message: 'Product not found' })

  const cart = await cartContainer.getById(id)

  if (!cart)
    return res.status(404).json({ error: 404, message: 'Cart not found' })

  cart.products.push(product)
  cart.updatedAt = Date.now()

  await cartContainer.updateById(id, cart)

  return res.status(201).json(cart)
})

cartRouter.delete('/:id/products/:idProd', async (req, res) => {
  const { id, idProd } = req.params

  const cart = await cartContainer.getById(id)

  if (!cart)
    return res.status(404).json({ error: 404, message: 'Cart not found' })

  cart.products = cart.products.filter((prod) => prod.id !== idProd)
  cart.updatedAt = Date.now()

  await cartContainer.updateById(id, cart)

  return res.status(204).end()
})
// #endregion

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
