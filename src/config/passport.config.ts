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
      async (email, password, done) => {
        console.log('🔎 Verificando credenciales')
        console.log({ email, password })

        // Obtenemos el usuario por el email
        const user = await userDAO.findByEmail(email)

        // Si el usuario no existe, se devuelve un error
        if (!user) { return done(null, false, { message: 'Invalid user or password' }) }

        // Si el usuario existe, se compara con la contraseña, sino la contraseña es vacia
        const isPasswordValid = comparePassword(password, user?.password ?? '')

        // Si la contraseña no es valida, se devuelve un error
        if (!isPasswordValid) { return done(null, false, { message: 'Invalid user or password' }) }

        return done(null, user) // Si todo sale bien, se devuelve el usuario
      }
    ))
}

export default initializePassport
