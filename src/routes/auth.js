import { Router } from 'express'
import { AuthController } from '../controllers/auth.js'
import { errorHandler, validateInputUser } from '../middlewares/index.js'
import { authorizeAdmin } from '../middlewares/authorizeAdmin.js'

const authRouter = Router()

authRouter.post('/login', AuthController.loginAdmin)
authRouter.post(
  '/',
  authorizeAdmin,
  validateInputUser,
  errorHandler,
  AuthController.create,
)

export default authRouter
