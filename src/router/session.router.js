import { Router } from 'express'
import { UsersDAO } from '../daos/users/users.mongo.dao.js'
import BCryptHelper from '../utils/bcrypt.helper.js'
import passport from 'passport'

const router = Router()

const usersContainer = new UsersDAO()

router.post(
  '/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  async (req, res) => {
    console.log('Login successful with passport authentication')

    const user = req.user

    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email
    }

    console.log('Setting up session for user with', req.session.user)

    return res.sendStatus(204)
  }
)

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: 400, message: 'Invalid or incomplete payload' })
  }

  const user = await usersContainer.getByEmail(email)

  if (user) { return res.status(409).json({ error: 409, message: 'User already exists' }) }

  const hashedPassword = BCryptHelper.hashPassword(password)

  const userPayload = await usersContainer.register({
    name,
    email,
    password: hashedPassword
  })

  return res.status(201).json(userPayload)
})

export default router
