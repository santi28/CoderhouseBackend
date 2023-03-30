// import { Router } from 'express'
// import { ProductsDAO } from '../daos/products/products.mongo.dao.js'
// import config from '../config/app.config.js'

// const router = Router()
// const productsContainer = new ProductsDAO()

// const authMiddleware = (req, res, next) => {
//   console.log('Auth middleware')
//   console.log(req.session.user)

//   if (!req.session.user) res.redirect('/login')

//   if (req.session.user) return next()
// }

// router.get('/', authMiddleware, async (req, res) => {
//   const products = await productsContainer.getAll()
//   res.render('main', { products, session: req.session.user })
// })

// router.get('/login', async (req, res) => {
//   res.render('login')
// })

// router.get('/register', async (req, res) => {
//   res.render('register')
// })

// router.get('/logout', async (req, res) => {
//   const session = req.session.user
//   req.session.destroy()

//   res.render('logout', { session })
// })

// router.get('/products/test', async (req, res) => {
//   res.render('products/test')
// })

// router.get('/info', async (req, res) => {
//   const serverInfo = {
//     title: process.title,
//     args: config.args,
//     execPath: process.execPath,
//     platform: process.platform,
//     pid: process.pid,
//     nodeVersion: process.version,
//     projectPath: process.cwd(),
//     reservedMemory: process.memoryUsage().rss,
//     uptime: process.uptime(),
//     cpus: process.cpus().length
//   }

//   res.json(serverInfo)
// })

// export default router

import { Router, Request, Response } from 'express'
const router = Router()

router.get('/register', (req: Request, res: Response) => {
  res.render('register')
})

export default router
