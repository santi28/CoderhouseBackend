import { Router } from 'express'

import accountsRouter from './accounts.router'
import productsRouter from './products.router'
import ordersRouter from './orders.router'
import appRouter from './app.router'
import cartsRouter from './carts.router'

const router = Router()

router.use('/', appRouter)

router.use('/api/accounts', accountsRouter)
router.use('/api/products', productsRouter)
router.use('/api/carts', cartsRouter)
router.use('/api/orders', ordersRouter)

export default router
