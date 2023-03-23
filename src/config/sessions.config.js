import session from 'express-session'
import MongoStore from 'connect-mongo'
import config from './app.config.js'

export const initSessions = (app) => {
  app.use(
    session({
      store: MongoStore.create({
        mongoUrl: config.db.uri,
        mongoOptions: {
          authSource: 'admin',
          auth: {
            username: config.db.user,
            password: config.db.password
          }
        },
        dbName: config.db.name,
        ttl: 60 * 1 // 10 minutes
      }),
      secret: config.session.secret,
      resave: false,
      saveUninitialized: false
    })
  )
}

export default initSessions
