import { Router } from 'express'
import { AuthController } from '../controllers/auth.js'
import { errorHandler, validateInputUser } from '../middlewares/index.js'

const authRouter = Router()

authRouter.post('/login', AuthController.loginAdmin)
authRouter.post('/', validateInputUser, errorHandler, AuthController.create)

export default authRouter
