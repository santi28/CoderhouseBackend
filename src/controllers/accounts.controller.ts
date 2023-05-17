import { Request, Response } from 'express'

import jwt from 'jsonwebtoken'
import config from '../config/app.config'
import { sendEmail } from '../services/comunications.service'
import UserDAO, { UserDocument } from '../dao/mongo/users.dao'
import getCompiledHTML, { Layouts } from '../utils/mailer/layout.helper'
// import { hashPassword } from '../utils/bcrypt.helper'

const userDAO = new UserDAO()

export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const avatar = req.file // Obtenemos el avatar del usuario
    const { name, email, password, phone } = req.body // Obtenemos los datos del usuario

    // Validamos que el payload sea correcto
    if (!name || !email || !password || !phone) { return res.status(400).json({ error: 400, message: 'Invalid or incomplete payload' }) }

    // Utilizamos el dao para crear el usuario
    const user = await userDAO.create({
      name,
      email,
      password,
      phone,
      avatar: avatar?.filename
    })

    // Generamos el html del correo
    const html = getCompiledHTML(
      Layouts.NEW_REGISTER,
      {
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    )

    // Enviamos un correo al administrador con los datos del usuario
    await sendEmail(
      config.app.administrator.email,
      'Nuevo usuario registrado',
      html
    )

    // Devolvemos el usuario creado
    return res.status(201).json(user)
  } catch (error: any) {
    if (error.code === 11000) { return res.status(409).json({ error: 409, message: 'User already exists' }) }

    console.error(error)
    return res.status(500).json({ error: 500, message: 'Internal server error' })
  }
}

export const login = async (req: Request, res: Response): Promise<any> => {
  // Obtenemos los datos del usuario provenientes del passport
  const user = req.user as UserDocument

  // Generamos el contenido del token
  const tokenPayload = { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }

  // Firmamos y generamos el token con una duracion de 1 hora
  const token = jwt.sign(tokenPayload, config.app.jwt.secret, { expiresIn: '1h' })

  // Devolvemos el token y los datos del usuario
  return res
    .cookie(config.app.jwt.cookie, token)
    .json({ ...tokenPayload, accessToken: token })
}

export const forgotPassword = async (req: Request, res: Response): Promise<any> => {
  const { email } = req.body

  // Validamos que el payload sea correcto
  if (!email) { return res.status(400).json({ error: 400, message: 'Invalid or incomplete payload' }) }

  // Obtenemos el usuario por el email
  const user = await userDAO.findByEmail(email)

  // Si el usuario no existe, se devuelve un error
  if (!user) { return res.status(404).json({ error: 404, message: 'User not found' }) }

  // Generamos el OTP para el usuario
  const otp = Math.floor(100000 + Math.random() * 900000)

  // Actualizamos el usuario con el OTP
  await userDAO.update(
    user._id.toString(),
    { recoveryCode: otp.toString() }
  )

  // Generamos el html del correo
  const html = getCompiledHTML(
    Layouts.FORGOT_PASSWORD,
    {
      name: user.name,
      email: user.email,
      url: `http://localhost:8080/reset-password?token=${otp}`
    }
  )

  // Enviamos un correo al usuario con el OTP
  await sendEmail(
    user.email,
    'Recuperación de contraseña',
    html
  )

  // Devolvemos un OK indicando que el correo fue enviado
  return res.status(200).json({ message: 'Email sent' })
}
