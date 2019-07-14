import path from 'path'
import express from 'express'
import cookieParser from 'cookie-parser'
import cookieSession from 'cookie-session'
import cors from 'cors'
import mongoose from 'mongoose'

import {
  PUBLIC_PORT, DB_HOST, DB_PORT, DB_NAME, SESSION_SECRET
} from './common/config';

import logger from './common/logger'
import publicRoutes from './api/public/routes'
import {passportConfig} from './api/configs/passport.config'

// Express Server Config
const app = express()
app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static(path.normalize(__dirname + '../public')))
app.use(cookieParser())
app.use(cookieSession({
  secret: SESSION_SECRET
}))
passportConfig(app)
app.use(publicRoutes)


app.listen(PUBLIC_PORT, () => console.log(`Server is running on port ${PUBLIC_PORT}`))

// Database Connection
const dbConnectString = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`
logger.info(dbConnectString)
mongoose.connect(dbConnectString, {useNewUrlParser: true, useCreateIndex: true})