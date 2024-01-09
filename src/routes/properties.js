import { Router } from 'express'
import { PropertyController } from '../controllers/properties.js'
import {
  validateIdAndPropertyExistence,
  uploadAndValidateCombined,
  errorHandler,
  uploadAndValidateCombinedUpdate,
} from '../middlewares/index.js'

const propertiesRouter = Router()

propertiesRouter.get('/', PropertyController.getAll)
propertiesRouter.get(
  '/:id',
  validateIdAndPropertyExistence,
  PropertyController.getById,
)
propertiesRouter.post(
  '/',
  uploadAndValidateCombined.single('image'),
  errorHandler,
  PropertyController.create,
)
propertiesRouter.patch(
  '/:id',
  uploadAndValidateCombinedUpdate.single('image'),
  errorHandler,
  PropertyController.update,
)
propertiesRouter.delete(
  '/:id',
  validateIdAndPropertyExistence,
  PropertyController.delete,
)

export default propertiesRouter
