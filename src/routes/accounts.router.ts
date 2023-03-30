import { Router, Request, Response } from 'express'
import userModel from '../dao/mongo/user.dao'
import expressAsyncHandler from 'express-async-handler'
import { hashPassword } from '../utils/bcrypt.helper'
import configurations from '../config/app.config'
import uploader from '../utils/multer.helper'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import { sendEmail } from '../services/comunications.service'

const router = Router()

router.post('/register', uploader.single('profileImage'), expressAsyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    try {
      const profileImage = req.file
      const { name, address, age, phone, email, password } = req.body

      // Validamos que el payload sea correcto
      if (!name || !address || !age || !phone || !email || !password) { return res.status(400).json({ error: 400, message: 'Invalid or incomplete payload' }) }

      // Creamos el usuario, encriptando la contraseña con bcrypt y guardándolo en la base de datos
      const user = await userModel.create({
        name,
        address,
        age,
        phone,
        email,
        password: hashPassword(password),
        avatar: `${req.protocol}://${req.hostname}:${configurations.port}/uploads/${profileImage?.filename ?? 'default.png'}`
      })

      await sendEmail(
        configurations.app.administrator.email,
        'Nuevo usuario registrado',
        `
          <h1>Se ha registrado un nuevo usuario en la plataforma</h1>
          <p>Nombre: ${name as string}</p>
          <p>Dirección: ${address as string}</p>
          <p>Edad: ${user.age?.toString() as string}</p>
          <p>Teléfono: ${user.phone as string}</p>
          <p>Email: ${user.email as string}</p>
          <p>Avatar: ${user.avatar}</p>
        `
      )

      // Devolvemos el usuario creado
      return res.status(201).json(user)
    } catch (error: any) {
      if (error.code === 11000) { return res.status(409).json({ error: 409, message: 'User already exists' }) }

      console.error(error)
      return res.status(500).json({ error: 500, message: 'Internal server error' })
    }
  }
))

router.post(
  '/login',
  passport.authenticate('login', { session: false }),
  expressAsyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      const user = req.user as any

      const tokenPayload = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }

      const token = jwt.sign(tokenPayload, configurations.app.jwt.secret, { expiresIn: '1h' })
      return res
        .cookie(configurations.app.jwt.cookie, token)
        .json({ token, user: tokenPayload })
    }
  )
)

export default router
