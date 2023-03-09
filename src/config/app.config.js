import minimist from 'minimist'
import dotenv from 'dotenv'
dotenv.config() // Configuramos la carga de variables de entorno

const args = minimist(process.argv.slice(2), {
  alias: {
    port: 'p'
  },
  default: {
    port: 3000
  }
}) // Obtenemos los argumentos de la línea de comandos

console.log(args)

export default {
  app: {
    port: args.port,
    env: process.env.NODE_ENV || 'development'
  },
  db: {
    name: process.env.DB_NAME || 'coderhouse',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    uri: process.env.DB_URI,
    adapter: process.env.DB_ADAPTER || 'mongodb'
  },
  session: {
    secret: process.env.SESSION_SECRET || 'secret'
  },
  args
}

// Env variable check
if (!process.env.DB_USER) throw new Error('DB_USER env variable is required')
if (!process.env.DB_PASS) throw new Error('DB_PASS env variable is required')
if (!process.env.DB_URI) throw new Error('DB_URI env variable is required')
