import { Router } from 'express'

import accountsRouter from './accounts.router'
import appRouter from './app.router'

const router = Router()

router.use((req, res, next) => {
  console.log(
    `Request received: ${req.method} ${req.url} from ${req.ip} at ${new Date().toString()}`
  )

  next()
})

router.use('/', appRouter)
router.use('/api/accounts', accountsRouter)

export default router
