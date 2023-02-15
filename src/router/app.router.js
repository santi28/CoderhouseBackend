import { Router } from 'express'
import { ProductsDAO } from '../daos/index.js'

const router = Router()
const productsContainer = new ProductsDAO()

router.get('/', async (req, res) => {
  const products = await productsContainer.getAll()
  res.render('main', { products })
})

router.get('/login', async (req, res) => {
  res.render('login')
})

router.get('/register', async (req, res) => {
  res.render('register')
})

router.get('/products/test', async (req, res) => {
  res.render('products/test')
})

export default router
