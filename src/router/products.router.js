import { Router } from 'express'
import { faker } from '@faker-js/faker'

import { ProductsDAO } from '../daos/products/products.mongo.dao.js'
import authMiddleware from '../middlewares/authentication.middleware.js'

const router = Router()
const productsContainer = new ProductsDAO()

router.get('/test', async (req, res) => {
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

router.get('/:id?', async (req, res) => {
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

router.post('/', authMiddleware, async (req, res) => {
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

router.put('/:id', async (req, res) => {
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

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  await productsContainer.deleteById(+id)

  return res.status(204).end()
})

export default router
