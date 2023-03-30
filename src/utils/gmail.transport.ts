import config from '../config/app.config'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: config.app.mailer.port ?? 587,
  auth: config.app.mailer.auth
})

export default transporter
