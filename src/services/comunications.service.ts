import configurations from '../config/app.config'
import transporter from '../utils/gmail.transport'
import twilio from 'twilio'

const twilioClient = twilio(
  configurations.app.twilio.accountSid,
  configurations.app.twilio.authToken
)

export const sendEmail = async (email: string, subject: string, html: string): Promise<any> => {
  const mail = await transporter.sendMail({
    from: 'SantiagoDN <santidenicolas@gmail.com>',
    to: email,
    subject,
    html
  })

  return mail
}

export const sendSMS = async (phone: string, message: string): Promise<any> => {
  const sms = await twilioClient.messages.create({
    to: phone,
    body: message,
    from: configurations.app.twilio.phoneNumber
  })

  return sms
}
