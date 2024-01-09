import { Router } from 'express'
import { VendorController } from '../controllers/vendors.js'
import {
  errorHandler,
  uploadAndValidateCombinedVendor,
  uploadAndValidateCombinedVendorUpdate,
  validateIdAndVendorExistence,
} from '../middlewares/index.js'

const vendorsRouter = Router()

vendorsRouter.get('/', VendorController.getAll)
vendorsRouter.get(
  '/:id',
  validateIdAndVendorExistence,
  VendorController.getById,
)
vendorsRouter.post(
  '/',
  uploadAndValidateCombinedVendor.single('image'),
  errorHandler,
  VendorController.create,
)
vendorsRouter.patch(
  '/:id',
  uploadAndValidateCombinedVendorUpdate.single('image'),
  errorHandler,
  VendorController.update,
)
vendorsRouter.delete(
  '/:id',
  validateIdAndVendorExistence,
  VendorController.delete,
)

export default vendorsRouter
