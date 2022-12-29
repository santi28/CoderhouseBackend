import express, { Router } from 'express'

import Contenedor from './Contenedor.js'
import { options } from './config/mariaDB.js'
// import { createCartTable, createProductsTable } from './scripts/createTables.js'

const app = express()
const PORT = process.env.PORT || 8080

// createCartTable()
// createProductsTable()

const productsContainer = new Contenedor(options, 'products')
const cartContainer = new Contenedor(options, 'cart')

const productsRouter = Router()
const cartRouter = Router()

const authMiddleware = (req, res, next) => {
  const { administrator } = req.headers

  if (administrator) return next()
  return res.status(401).json({ error: 401, message: 'Unauthorized' })
}

// Middlewares

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/products', productsRouter)
app.use('/api/cart', cartRouter)

// #region Products Router
productsRouter.get('/:id?', async (req, res) => {
  const { id } = req.params

  if (id) {
    const product = await productsContainer.getById(+id)
    if (!product)
      return res.status(404).json({ error: 404, message: 'Product not found' })

    return res.json(product)
  } else {
    const products = await productsContainer.getAll()
    return res.json(products)
  }
})

productsRouter.post('/', authMiddleware, async (req, res) => {
  const { name, description, code, picture, price, stock } = req.body

  if (!name || !description || !code || !picture || !price || !stock)
    return res.status(400).json({
      error: 400,
      message: 'Mandatory fileds are missing'
    })

  const newProduct = { name, description, code, picture, price, stock }
  newProduct.timestamp = Date.now()

  const newProductId = await productsContainer.save(newProduct)
  const product = await productsContainer.getById(newProductId)

  return res.status(201).json(product)
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

  const cart = await cartContainer.getById(+id)

  if (!cart)
    return res.status(404).json({ error: 404, message: 'Cart not found' })

  return res.json(cart.products)
})

cartRouter.post('/:id/products', async (req, res) => {
  const { id } = req.params
  const { productId } = req.body

  const product = await productsContainer.getById(+productId)

  if (!product)
    return res.status(404).json({ error: 404, message: 'Product not found' })

  const cart = await cartContainer.getById(+id)

  if (!cart)
    return res.status(404).json({ error: 404, message: 'Cart not found' })

  cart.products.push(product)
  cart.updatedAt = Date.now()

  await cartContainer.updateById(+id, cart)

  return res.status(201).json(cart)
})

cartRouter.delete('/:id/products/:idProd', async (req, res) => {
  const { id, idProd } = req.params

  const cart = await cartContainer.getById(+id)

  if (!cart)
    return res.status(404).json({ error: 404, message: 'Cart not found' })

  cart.products = cart.products.filter((prod) => prod.id !== +idProd)
  cart.updatedAt = Date.now()

  await cartContainer.updateById(+id, cart)

  return res.status(204).end()
})
// #endregion

app.listen(
  PORT,
  console.log(`🚀 Server running on url http://localhost:${PORT}`)
)
