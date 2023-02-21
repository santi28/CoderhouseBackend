import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { UsersDAO } from '../daos/users/users.mongo.dao.js'

import BCryptHelper from '../utils/bcrypt.helper.js'

const userContainer = new UsersDAO()

const initPassport = () => {
  passport.use(
    'signup',
    new LocalStrategy(async (username, password, done) => {
      const gettedUser = await userContainer.getByEmail(username)

      if (gettedUser)
        return done(null, false, { message: 'User already exists' })

      const hashedPassword = BCryptHelper.hashPassword(password)
      const newUser = await userContainer.register({
        email: username,
        password: hashedPassword
      })

      return done(null, newUser)
    })
  )

  passport.use(
    'login',
    new LocalStrategy(async (username, password, done) => {
      console.log(
        `Initializing login with username: ${username} and password: ${password}`
      )

      const gettedUser = await userContainer.getByEmail(username)

      if (!gettedUser) return done(null, false, { message: 'User not found' })

      if (!BCryptHelper.isValidPassword(password, gettedUser.password))
        return done(null, gettedUser)

      return done(null, gettedUser)
    })
  )

  passport.serializeUser((user, done) => {
    done(null, user.email)
  })

  passport.deserializeUser(async (email, done) => {
    const user = await userContainer.getByEmail(email)
    done(null, user)
  })
}

export default initPassport
