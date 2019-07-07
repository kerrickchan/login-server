import sgMail from '@sendgrid/mail'
import {ClientResponse} from "@sendgrid/client/src/response";
import logger from '../../common/logger'
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

async function sendEmail(from: string, to: string, subject: string, text: string, html: string): Promise<[ClientResponse, {}]> {
  const mail = {
    to,
    from,
    subject,
    text,
    html,
  }

  return await sgMail.send(mail)
}

export async function sendActivateEmail(to: string, token: string): Promise<[ClientResponse, {}]> {
  const from = 'activate@88chan.synogloy.me'

  const url = `http://localhost:${process.env.PUBLIC_PORT}/users/activate?token=${token}`
  const text = `active link is ${url}. You have 30 minutes to activate`
  const html = `active link in <a href="${url}">here</a>. You have 30 minutes to activate`

  logger.info('send activate email to ' + to)
  return await sendEmail(from, to, 'Register Activation Email', text, html)
}