import session from 'express-session'
import MongoStore from 'connect-mongo'

export const initSessions = (app) => {
  app.use(
    session({
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        mongoOptions: {
          authSource: 'admin',
          auth: {
            username: process.env.MONGO_USER,
            password: process.env.MONGO_PASS
          }
        },
        dbName: process.env.MONGO_DB,
        ttl: 60 * 1 // 10 minutes
      }),
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false
    })
  )
}

export default initSessions
