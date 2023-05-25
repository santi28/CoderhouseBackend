import path from 'path'
import { engine } from 'express-handlebars'
import { Express } from 'express'

export default async function initTemplateEngine (app: Express): Promise<void> {
  const hbs = engine({
    extname: 'hbs',
    layoutsDir: path.join(__dirname, '../../views/layouts'),
    partialsDir: path.join(__dirname, '../../views/partials'),
    defaultLayout: 'main',
    helpers: {
      ifEquals: function (arg1: any, arg2: any, options: any) {
        return (arg1 === arg2) ? options.fn(this) : options.inverse(this)
      }
    }
  })

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  app.engine('hbs', hbs)
  app.set('view engine', 'hbs')

  app.set('views', './views')
}
