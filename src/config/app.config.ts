import minimist from 'minimist'
import dotenv from 'dotenv'

// Cargamos las variables de entorno desde el archivo .env
dotenv.config()

// Cargamos los argumentos de la línea de comandos
const args = minimist(process.argv.slice(2), {
  alias: { port: 'p' },
  default: { port: 3000 }
})

// Definimos la configuración de la aplicación
// siguiendo el orden de carga de variables: .env > args > default
const configurations = {
  port: Number(process.env.SERVER_PORT ?? args.port) ?? 3000,
  env: process.env.NODE_ENV ?? 'development',
  db: {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT) ?? 27017,
    name: process.env.DB_NAME ?? 'coderhouse',
    username: process.env.DB_USER ?? '',
    password: process.env.DB_PASS ?? ''
  },
  app: {
    administrator: {
      name: process.env.ADMIN_NAME ?? 'Admin',
      email: process.env.ADMIN_EMAIL ?? '',
      phone: process.env.ADMIN_PHONE ?? ''
    },
    session: {
      secret: process.env.SESSION_SECRET ?? ''
    },
    jwt: {
      secret: process.env.JWT_SECRET ?? '',
      cookie: process.env.JWT_COOKIE ?? 'sid'
    },
    mailer: {
      host: process.env.MAILER_HOST ?? '',
      port: Number(process.env.MAILER_PORT) ?? 587,
      auth: {
        user: process.env.MAILER_USER ?? '',
        pass: process.env.MAILER_PASS ?? ''
      }
    },
    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID ?? '',
      authToken: process.env.TWILIO_AUTH_TOKEN ?? '',
      phoneNumber: process.env.TWILIO_PHONE_NUMBER ?? '',
      whatsappNumber: process.env.TWILIO_WHATSAPP_NUMBER ?? ''
    }
  }
}

console.log('✅ Configuration loaded successfully')

// Exportamos la configuración
export default configurations
