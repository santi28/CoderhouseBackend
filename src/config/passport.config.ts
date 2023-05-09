import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { comparePassword } from '../utils/bcrypt.helper'
import UserDAO from '../dao/mongo/users.dao'

const userDAO = new UserDAO()

export const initializePassport = (): void => {
  passport.use(
    'login',
    new LocalStrategy(
      { usernameField: 'email' },
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      async (email, password, done) => {
        console.log('Initializing login using passport local', {
          email,
          password
        })

        // Buscamos el usuario por email
        const user = await userDAO.findByEmail(email)
        // Si el usuario existe, se compara con la contraseña, sino la contraseña es vacia
        const isPasswordValid = comparePassword(password, user?.password ?? '')

        if (!user || !password || !isPasswordValid) { return done(null, false, { message: 'Invalid credentials' }) }

        return done(null, user)
      }
    ))
}

export default initializePassport
