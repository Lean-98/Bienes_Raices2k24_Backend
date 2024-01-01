import { Router } from 'express'
import { AuthController } from '../controllers/auth.js'

const authRouter = Router()

authRouter.post('/login', AuthController.loginAdmin)
authRouter.post('/', AuthController.create)

export default authRouter
