import path from 'path'
import handlebars from 'express-handlebars'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const initHandlebars = (app) => {
  app.engine(
    'hbs',
    handlebars.engine({
      extname: '.hbs',
      defaultLayout: 'index.hbs',
      layoutsDir: path.join(__dirname, '../views/layouts'),
      partialsDir: path.join(__dirname, '../views/partials')
    })
  )

  app.set('view engine', 'hbs')
  app.set('views', './src/views')
}

export default initHandlebars
