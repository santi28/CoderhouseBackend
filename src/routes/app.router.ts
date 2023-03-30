import { Router, Request, Response } from 'express'
import { executePolicy } from '../middlewares/authenticate.middleware'
import configurations from '../config/app.config'
import expressAsyncHandler from 'express-async-handler'
import axios from 'axios'

const router = Router()

router.get(
  '/', executePolicy(['AUTHENTICATED']),
  expressAsyncHandler(
    async (req: Request, res: Response) => {
      const { data: products } = await axios.get(`http://${req.hostname}:${configurations.port}/api/products`)

      res.render('index', { session: req.user, products })
    }
  )
)

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

router.get('/products/add', executePolicy(['admin']), (req: Request, res: Response) => {
  res.render('products/add', { session: req.user })
})

router.get('/checkout', executePolicy(['AUTHENTICATED']), (req: Request, res: Response) => {
  res.render('checkout', { session: req.user })
})

export default router
