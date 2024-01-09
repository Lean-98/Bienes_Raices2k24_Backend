import { validate } from 'uuid'
import { VendorModel } from '../models/vendor.js'

export const validateIdAndVendorExistence = async (req, res, next) => {
  const { id } = req.params

  if (!validate(id)) {
    return res.status(400).json({
      message: 'Invalid UUID format',
    })
  }

  const existingVendor = await VendorModel.find({ id })

  if (!existingVendor) {
    return res.status(404).json({
      message: 'Vendor not found',
    })
  }

  next()
}
