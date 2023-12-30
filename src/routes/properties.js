import { Router } from 'express'
import { PropertyController } from '../controllers/properties.js'

const propertiesRouter = Router()

propertiesRouter.get('/', PropertyController.getAll)
propertiesRouter.get('/:id', PropertyController.getById)
propertiesRouter.post('/', PropertyController.create)
propertiesRouter.patch('/:id', PropertyController.update)
propertiesRouter.delete('/:id', PropertyController.delete)

export default propertiesRouter
