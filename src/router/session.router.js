import { Router } from 'express'
import { UsersDAO } from '../daos/users/users.mongo.dao.js'
const router = Router()

const usersContainer = new UsersDAO()

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  // Comprueba la validez del payload
  if (!email || !password)
    return res
      .status(400)
      .json({ error: 400, message: 'Invalid or incomplete payload' })

  const user = await usersContainer.login(email, password)
  console.log(user)

  // Comprueba si el usuario existe
  if (!user)
    return res
      .status(401)
      .json({ error: 401, message: 'Invalid email or password' })

  // En caso de que el usuario exista, devuelve el usuario y genera una sesión
  req.session.user = {
    id: user._id,
    name: user.name,
    email: user.email
  }

  return res.sendStatus(204)
})

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password)
    return res
      .status(400)
      .json({ error: 400, message: 'Invalid or incomplete payload' })

  const user = await usersContainer.getByEmail(email)

  if (user)
    return res.status(409).json({ error: 409, message: 'User already exists' })

  const userPayload = await usersContainer.register({ name, email, password })

  return res.status(201).json(userPayload)
})

export default router
