// import { Router } from 'express'
// import { UsersDAO } from '../daos/users/users.mongo.dao.js'
// import BCryptHelper from '../utils/bcrypt.helper.js'
// import passport from 'passport'

// const router = Router()

// const usersContainer = new UsersDAO()

// router.post(
//   '/login',
//   passport.authenticate('local', { failureRedirect: '/login' }),
//   async (req, res) => {
//     console.log('Login successful with passport authentication')

//     const user = req.user

//     req.session.user = {
//       id: user._id,
//       name: user.name,
//       email: user.email
//     }

//     console.log('Setting up session for user with', req.session.user)

//     return res.sendStatus(204)
//   }
// )

// router.post('/register', async (req, res) => {
//   const { name, email, password } = req.body

//   if (!name || !email || !password) {
//     return res
//       .status(400)
//       .json({ error: 400, message: 'Invalid or incomplete payload' })
//   }

//   const user = await usersContainer.getByEmail(email)

//   if (user) { return res.status(409).json({ error: 409, message: 'User already exists' }) }

//   const hashedPassword = BCryptHelper.hashPassword(password)

//   const userPayload = await usersContainer.register({
//     name,
//     email,
//     password: hashedPassword
//   })

//   return res.status(201).json(userPayload)
// })

// export default router

import { Router, Request, Response } from 'express'
import userModel from '../dao/mongo/user.dao'
import expressAsyncHandler from 'express-async-handler'
import { hashPassword } from '../utils/bcrypt.helper'
import configurations from '../config/app.config'
import uploader from '../utils/multer.helper'
const router = Router()

router.post('/register', uploader.single('profileImage'), expressAsyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    try {
      console.log(req.file)
      console.log(req.body)

      const profileImage = req.file
      const { name, email, password } = req.body

      // Validamos que el payload sea correcto
      if (name === undefined || email === undefined || password === undefined) { return res.status(400).json({ error: 400, message: 'Invalid or incomplete payload' }) }

      // Creamos el usuario, encriptando la contraseña con bcrypt y guardándolo en la base de datos
      const user = await userModel.create({
        name,
        email,
        password: hashPassword(password),
        avatar: `${req.protocol}://${req.hostname}:${configurations.port}/public/${profileImage?.filename ?? 'default.png'}`
      })

      // Devolvemos el usuario creado
      return res.status(201).json(user)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 500, message: 'Internal server error' })
    }
  }
))

export default router
