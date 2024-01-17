import { Router } from 'express'
import { PropertyController } from '../controllers/properties.js'
import {
  validateIdAndPropertyExistence,
  uploadAndValidateCombinedProperty,
  errorHandler,
  uploadAndValidateCombinedPropertyUpdate,
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
  uploadAndValidateCombinedProperty.array('images', 6),
  errorHandler,
  PropertyController.create,
)
propertiesRouter.patch(
  '/:id',
  uploadAndValidateCombinedPropertyUpdate.array('images', 6),
  errorHandler,
  PropertyController.update,
)
propertiesRouter.delete(
  '/:id',
  validateIdAndPropertyExistence,
  PropertyController.delete,
)

export default propertiesRouter
