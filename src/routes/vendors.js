import { Router } from 'express'
import { VendorController } from '../controllers/vendors.js'
import upload from '../multerconfig.js'
import {
  validateUuidAndVendorsExistence,
  validateUUID,
} from '../middlewares/index.js'

const vendorsRouter = Router()

vendorsRouter.get('/', VendorController.getAll)
vendorsRouter.get(
  '/:id',
  validateUuidAndVendorsExistence,
  VendorController.getById,
)
vendorsRouter.post('/', upload.single('image'), VendorController.create)
vendorsRouter.patch(
  '/:id',
  validateUuidAndVendorsExistence,
  upload.single('image'),
  VendorController.update,
)
vendorsRouter.delete('/:id', validateUUID, VendorController.delete)

export default vendorsRouter
