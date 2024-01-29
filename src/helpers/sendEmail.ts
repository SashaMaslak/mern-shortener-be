import sgMail, { MailDataRequired } from '@sendgrid/mail'
import { IBodyEmail } from '../types.js'
import dtnv from 'dotenv'
dtnv.config()

const { SENDGRID_API_KEY } = process.env

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY)
}

export const sendEmail = async (data: IBodyEmail) => {
  const email: MailDataRequired = {
    ...data,
    from: 'owmaslak@gmail.com',
  }
  await sgMail.send(email)
  return true
}
