import { Router, Request, Response } from 'express'
import { executePolicy } from '../middlewares/authenticate.middleware'
import configurations from '../config/app.config'

const router = Router()

router.get('/', executePolicy(['AUTHENTICATED']), (req: Request, res: Response) => {
  res.render('index', { session: req.user })
})

router.get('/register', (req: Request, res: Response) => {
  res.render('register')
})

router.get('/login', (req: Request, res: Response) => {
  res.render('login')
})

router.get('/logout', (req: Request, res: Response) => {
  // Borramos la cookie de sesión
  res.clearCookie(configurations.app.jwt.cookie)
  // Mostramos la vista de logout
  res.render('logout')
})

export default router
