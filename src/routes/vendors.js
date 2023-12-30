import { Router } from 'express'
import { VendorController } from '../controllers/vendors.js'

const vendorsRouter = Router()

vendorsRouter.get('/', VendorController.getAll)
vendorsRouter.get('/:id', VendorController.getById)
vendorsRouter.post('/', VendorController.create)
vendorsRouter.patch('/:id', VendorController.update)
vendorsRouter.delete('/:id', VendorController.delete)

export default vendorsRouter
