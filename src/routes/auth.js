import { Router } from 'express'
import { AuthController } from '../controllers/auth.js'
import {
  errorHandler,
  validateInputUser,
  verifyToken,
} from '../middlewares/index.js'

const authRouter = Router()

authRouter.post('/login', AuthController.loginAdmin)
authRouter.post(
  '/',
  verifyToken,
  validateInputUser,
  errorHandler,
  AuthController.create,
)

export default authRouter
