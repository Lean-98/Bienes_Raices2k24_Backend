import { validate } from 'uuid'
import { PropertyModel } from '../models/property.js'

export const validateUuidAndPropertiesExistence = async (req, res, next) => {
  const { id } = req.params

  if (!validate(id)) {
    return res.status(400).json({
      message: 'Invalid UUID format',
    })
  }

  const existingProperty = await PropertyModel.find({ id })

  if (!existingProperty) {
    return res.status(404).json({
      message: 'Property not found',
    })
  }

  next()
}
