import fs from 'fs'

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
  const text = `active link is ${url}.`
  // const html = `active link in <a href="${url}">here</a>. You have 30 minutes to activate`
  let activateEmailTemplate = await fs.readFileSync(__dirname + '/emails/activate.email.html', {encoding: 'utf-8'})

  activateEmailTemplate = activateEmailTemplate.replace(/%APP_NAME%/, process.env.APP_NAME)
                                               .replace(/%URL%/g, url)
                                               .replace(/%SIGNATURE%/, 'Regards,<br>Eric Chan')
                                               .replace(/%THIS_YEAR%/, new Date().getFullYear().toString())
                                               .replace(/%COMPANY_NAME%/, 'Login Module Project')

  return await sendEmail(from, to, 'Register Activation Email', text, activateEmailTemplate)
}