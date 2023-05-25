import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import configurations from '../config/app.config'

export const executePolicy = (policies: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (policies[0] === 'PUBLIC') return next()

    const token = req.cookies[configurations.app.jwt.cookie]

    // Verificamos que el token exista, si no, redirigimos al login
    if (!token) return res.status(401).json({ error: 401, message: 'Unauthorized' })

    try {
      // Decodificamos el token y verificamos el rol del usuario
      const decoded = jwt.verify(token, configurations.app.jwt.secret) as any

      console.log('URL => ', req.url, 'POLICIES => ', policies, 'DECODED => ', decoded.role)

      if (
        policies[0] !== 'AUTHENTICATED' &&
        !policies.includes(decoded.role)
      ) return res.status(401).json({ error: 401, message: 'Unauthorized' })

      // Si el token es válido, lo añadimos a la request
      req.user = decoded
      return next()
    } catch (error) {
      res.clearCookie(configurations.app.jwt.cookie)
      return res.status(401).json({ error: 401, message: 'Unauthorized' })
    }
  }
}

export const executeFrontendPolicy = (policies: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (policies[0] === 'PUBLIC') return next()

    const token = req.cookies[configurations.app.jwt.cookie]

    // Verificamos que el token exista, si no, redirigimos al login
    if (!token) return res.redirect('/login')

    try {
      // Decodificamos el token y verificamos el rol del usuario
      const decoded = jwt.verify(token, configurations.app.jwt.secret) as any

      console.log('URL => ', req.url, 'POLICIES => ', policies, 'DECODED => ', decoded.role)

      if (
        policies[0] !== 'AUTHENTICATED' &&
        !policies.includes(decoded.role)
      ) return res.redirect('/login')

      // Si el token es válido, lo añadimos a la request
      req.user = decoded
      return next()
    } catch (error) {
      res.clearCookie(configurations.app.jwt.cookie)
      return res.redirect('/login')
    }
  }
}
