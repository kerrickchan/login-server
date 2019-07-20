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
      usernameField: 'username',
      passwordField: 'password'
    },
    function(username: string, password: string, done: any) {
      logger.debug('password is ', password)
      User.findOne({username}, (err: any, user: IUser) => {
        if (err) return done(err)

        if (!user) {
          return done(null, false, {errors: [{ msg: 'Incorrect username.' }]});
        }

        logger.debug('password is ', password)
        if (!user.validPassword(password)) {
          return done(null, false, {errors: [{ msg: 'Incorrect password.' }]});
        }

        return done(null, user)
      })
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