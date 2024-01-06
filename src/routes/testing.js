import { Router } from 'express'
import { ping } from '../controllers/testing.js'

const testingRouter = Router()

testingRouter.get('/', ping)

export default testingRouter
