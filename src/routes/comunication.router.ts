import { Router } from 'express'
import expressAsyncHandler from 'express-async-handler'
import twilio from 'twilio'

import mailer from '../utils/gmail.transport'
import configurations from '../config/app.config'

const router = Router()
const twilioClient = twilio(
  configurations.app.twilio.accountSid,
  configurations.app.twilio.authToken
)

router.get(
  '/mailer/send',
  expressAsyncHandler(
    async (req, res) => {
      const { from, to, subject, message } = req.query

      const mail = await mailer.sendMail({
        from: from as string,
        to: to as string,
        subject: subject as string,
        html: message as string,
        attachments: [
          {
            filename: 'elpepe.jpg',
            path: 'https://picsum.photos/200/300'
          }
        ]
      })

      res.json(mail)
    }
  )
)

router.get(
  '/sms/send',
  expressAsyncHandler(
    async (req, res) => {
      const { message } = req.query

      const sms = await twilioClient.messages.create({
        body: message as string,
        from: configurations.app.twilio.phoneNumber,
        to: '+541151623055'
      })

      res.json(sms)
    }
  )
)

export default router
