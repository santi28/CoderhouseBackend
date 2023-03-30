import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import configurations from '../config/app.config'

export const executePolicy = (policies: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (policies[0] === 'PUBLIC') return next()

    const token = req.cookies[configurations.app.jwt.cookie]

    // Si no hay token, redirigimos al usuario a la página de login
    if (!token) return res.redirect('/login')

    try {
      const decoded = jwt.verify(token, configurations.app.jwt.secret) as any
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
