import appRouter from './app.router.js'
import productsRouter from './products.router.js'
import sessionRouter from './session.router.js'
import cartsRouter from './cart.router.js'

import { Router } from 'express'
const router = Router()

router.use('/', appRouter)
router.use('/api/products', productsRouter)
router.use('/api/accounts', sessionRouter)
router.use('/api/cart', cartsRouter)

export default router
