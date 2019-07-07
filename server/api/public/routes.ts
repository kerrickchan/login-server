import express, {Request, Response} from 'express'
import usersRouter from './auth/router'
const router = express.Router()

router.use('/test', (req: Request, res: Response) => {
  res.send('Hello World')
})

router.use(usersRouter)

export default router