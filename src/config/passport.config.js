import passport from 'passport'
import passportLocal from 'passport-local'

import { UsersDAO } from '../daos/users/users.mongo.dao.js'
import BCryptHelper from '../utils/bcrypt.helper.js'

// import BCryptHelper from '../utils/bcrypt.helper.js'

const userContainer = new UsersDAO()
const LocalStrategy = passportLocal.Strategy

const loginStrategy = new LocalStrategy(
  { usernameField: 'email' },
  async (username, password, done) => {
    console.log('Initializing login using passport local', {
      username,
      password
    })

    const user = await userContainer.getByEmail(username)

    const isPasswordValid = BCryptHelper.isValidPassword(
      password,
      user?.password
    )

    if (!user & !isPasswordValid) { return done(null, false, { message: 'Invalid credentials' }) }

    return done(null, user)
  }
)

const initPassport = (app) => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(loginStrategy)

  passport.serializeUser((user, done) => {
    done(null, user)
  })

  passport.deserializeUser(async (user, done) => {
    done(null, user)
  })
}

export default initPassport
