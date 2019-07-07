import express from 'express'
import controller from './controller'

export default express.Router()
  .post('/users/register', controller.register)
  .get('/users/activate', controller.activate)
  // .post('/users/login', controller.login)
  // .post('/users/refresh', controller.refresh)
  // .post('/users/check', controller.check)
  // .post('/users/forgetPw', controller.sendCode)
  // .put('/users/updatePw', controller.setpw)