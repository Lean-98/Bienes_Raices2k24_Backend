import { Router } from 'express'
import { PropertyController } from '../controllers/properties.js'
import upload from '../multerconfig.js'
import {
  validateUuidAndPropertiesExistence,
  validateUUID,
} from '../middlewares/index.js'

const propertiesRouter = Router()

propertiesRouter.get('/', PropertyController.getAll)
propertiesRouter.get(
  '/:id',
  validateUuidAndPropertiesExistence,
  PropertyController.getById,
)
propertiesRouter.post('/', upload.single('image'), PropertyController.create)
propertiesRouter.patch(
  '/:id',
  validateUuidAndPropertiesExistence,
  upload.single('image'),
  PropertyController.update,
)
propertiesRouter.delete('/:id', validateUUID, PropertyController.delete)

export default propertiesRouter
