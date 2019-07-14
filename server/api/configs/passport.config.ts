import {Application} from 'express'
import passport from 'passport'
import {Strategy as LocalStrategy} from 'passport-local'

import logger from '../../common/logger'
import {IUser, User} from '../models/user.model'

export function passportConfig(app: Application) {
  app.use(passport.initialize())
  app.use(passport.session())

  // Setup passport middleware
  passport.use(new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    function(email: string, password: string, done: any) {
      logger.debug('email is ' + email)
      done(null, true)
    }
  ))

  passport.serializeUser(function(user: IUser, done: any) {
    done(null, user._id)
  });

  passport.deserializeUser(function(id: string, done: any) {
    User.findById(id, function(err: any, user: IUser) {
      done(err, user)
    })
  })
}