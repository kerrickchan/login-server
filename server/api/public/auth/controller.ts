import {Request, Response} from 'express'
import validator from 'validator'
import crypto from 'crypto'
import moment from 'moment'

import logger from '../../../common/logger'

import {UserRepository} from '../../repositories/user.repository'
import {TokenRepository} from '../../repositories/token.repository'

import {BAD_REQUEST, NOT_ACCEPTABLE, INTERNAL_SERVER_ERROR} from '../../common/status'
import {encrypt, decrypt, hash} from '../../services/password.service'
import {sendActivateEmail} from '../../services/email.service'

export class Controller {
  userRepo: UserRepository
  tokenRepo: TokenRepository

  constructor() {
    this.userRepo = new UserRepository()
    this.tokenRepo = new TokenRepository()
  }

  public register = async (req: Request, res: Response): Promise<void> => {
    // validate
    const {username, email, password, password2} = req.body

    if (!username) {
      res.status(BAD_REQUEST).json({errors: [{msg: 'username cannot be empty'}]})
      return
    }

    if (!email) {
      res.status(BAD_REQUEST).json({errors: [{msg: 'email cannot be empty'}]})
      return
    }

    if (email && !validator.isEmail(email)) {
      res.status(BAD_REQUEST).json({errors: [{msg: 'email field is invalid'}]})
      return
    }

    if (!password) {
      res.status(BAD_REQUEST).json({errors: [{msg: 'password cannot be empty'}]})
      return
    }

    if (!password2) {
      res.status(BAD_REQUEST).json({errors: [{msg: 're-enter password cannot be empty'}]})
      return
    }

    if (password != password2) {
      res.status(BAD_REQUEST).json({errors: [{msg: 'password and re-enter password are not the same'}]})
      return
    }

    // find existing
    const user = await this.userRepo.findOne({username})
    if (user) {
      res.status(NOT_ACCEPTABLE).json({errors: [{msg: 'username already exists'}]})
      return
    }

    // register success
    const isActivated = false
    const createdUser = await this.userRepo.create({username, email: [{value: email, type: 'main'}] ,isActivated})
    await createdUser.setPassword(password)

    // send email
    if(createdUser) {
      const token = crypto.randomBytes(64).toString('hex')
      const expiredAt = moment().add(14, 'days').format()
      this.tokenRepo.create({user: createdUser._id, token, expiredAt})

      // FIXME: comment out for do not send active email
      // sendActivateEmail(email, token)
      res.json({success: true, data: {}, errors: []})
      return
    }

    res.status(INTERNAL_SERVER_ERROR).json({success: false, data: {}, errors: [{msg: 'unknown register error'}]})
    logger.error('unknown register error')
  }

  public activate = async (req: Request, res: Response): Promise<void> => {
    const {token} = req.query

    // validate
    if (!token) {
      res.status(BAD_REQUEST).json({errors: [{msg: 'token not found'}]})
      return
    }

    const sentToken = await this.tokenRepo.findOne({token})
    if (sentToken.isExpired()) {
      res.status(NOT_ACCEPTABLE).json({errors: [{msg: 'token expired'}]})
      return
    } else if (sentToken.token === token) {
      const user = await this.userRepo.findById(sentToken.user)
      user.isActivated = true
      user.save()
    }

    res.json({success: true, data: {}, errors: []})
  }

  public login = async (req: Request, res: Response): Promise<void> => {
    res.json({msg: 'it works'})
  }
  // public refresh async (req: Request, res: Response): Promise<void> => {}
  // public check async (req: Request, res: Response): Promise<void> => {}
  // public sendCode async (req: Request, res: Response): Promise<void> => {}
  // public setpw async (req: Request, res: Response): Promise<void> => {}
}

export default new Controller()