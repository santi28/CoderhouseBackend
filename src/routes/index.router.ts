import { Router } from 'express'

import accountsRouter from './accounts.router'
import appRouter from './app.router'

const router = Router()

router.use('/', appRouter)
router.use('/api/accounts', accountsRouter)

export default router
