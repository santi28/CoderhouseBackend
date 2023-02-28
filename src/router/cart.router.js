import { Router } from 'express'
import { CartsDAO } from '../daos/carts/carts.mongo.dao.js'
import { ProductsDAO } from '../daos/products/products.mongo.dao.js'

const cartRouter = Router()
const cartContainer = new CartsDAO()
const productsContainer = new ProductsDAO()

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

export default cartRouter
