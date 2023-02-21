import { Router } from 'express'
import { ProductsDAO } from '../daos/index.js'

const router = Router()
const productsContainer = new ProductsDAO()

const authMiddleware = (req, res, next) => {
  console.log(req.session.user)

  if (!req.session.user) res.redirect('/login')

  if (req.session.user) return next()
}

router.get('/', authMiddleware, async (req, res) => {
  const products = await productsContainer.getAll()
  res.render('main', { products, session: req.session.user })
})

router.get('/login', async (req, res) => {
  res.render('login')
})

router.get('/register', async (req, res) => {
  res.render('register')
})

router.get('/logout', async (req, res) => {
  const session = req.session.user
  req.session.destroy()

  res.render('logout', { session })
})

router.get('/products/test', async (req, res) => {
  res.render('products/test')
})

export default router
