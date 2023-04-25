import configurations from '../config/app.config'
import transporter from '../utils/gmail.transport'
import twilio from 'twilio'

const twilioClient = twilio(
  configurations.app.twilio.accountSid,
  configurations.app.twilio.authToken
)

export const sendEmail = async (email: string, subject: string, html: string): Promise<any> => {
  console.log(
    `📧 Sending email to ${email} from ${configurations.app.mailer.auth.user}`
  )

  const mail = await transporter.sendMail({
    from: 'SantiagoDN <santidenicolas@gmail.com>',
    to: email,
    subject,
    html
  })

  return mail
}

export const sendSMS = async (phone: string, message: string): Promise<any> => {
  console.log(
    `📱 Sending sms to ${phone} from ${configurations.app.twilio.phoneNumber}`
  )

  const sms = await twilioClient.messages.create({
    to: phone,
    body: message,
    from: configurations.app.twilio.phoneNumber
  })

  return sms
}

export const sendWhatsApp = async (phone: string, message: string): Promise<any> => {
  console.log(
    `📱 Sending whatsapp message to ${phone} from ${configurations.app.twilio.whatsappNumber}`
  )

  const sms = await twilioClient.messages.create({
    to: `whatsapp:${phone}`,
    body: message,
    from: `whatsapp:${configurations.app.twilio.whatsappNumber}`
  })

  return sms
}
