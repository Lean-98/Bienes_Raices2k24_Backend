import { validate } from 'uuid'
import { TestimonialModel } from '../models/testimonial.js'

export const validateIdAndTestimonialExistence = async (req, res, next) => {
  const { id } = req.params

  if (!validate(id)) {
    return res.status(400).json({
      message: 'Invalid UUID format',
    })
  }

  const existingTestomonial = await TestimonialModel.find({ id })

  if (!existingTestomonial) {
    return res.status(404).json({
      message: 'Blog not found',
    })
  }

  next()
}
