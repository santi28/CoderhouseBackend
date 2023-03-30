import { Router, Request, Response } from 'express'
import { executePolicy } from '../middlewares/authenticate.middleware'

const router = Router()

router.get('/register', (req: Request, res: Response) => {
  res.render('register')
})

router.get('/login', (req: Request, res: Response) => {
  res.render('login')
})

router.get('/', executePolicy(['AUTHENTICATED']), (req: Request, res: Response) => {
  res.render('index', { session: req.user })
})

export default router
