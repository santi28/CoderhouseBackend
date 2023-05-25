import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'sid75@ethereal.email',
    pass: '5khmtZBX5ja62A79Gs'
  }
})

export default transporter
