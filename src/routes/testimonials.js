import { Router } from 'express'
import { TestimonialController } from '../controllers/testimonials.js'
import {
  errorHandler,
  validateIdAndTestimonialExistence,
  validateInputTestimonial,
  validateTestimonialUpdate,
} from '../middlewares/index.js'

const testimonialsRouter = Router()

testimonialsRouter.get('/', TestimonialController.getAll)
testimonialsRouter.get(
  '/:id',
  validateIdAndTestimonialExistence,
  TestimonialController.getById,
)
testimonialsRouter.post(
  '/',
  validateInputTestimonial,
  errorHandler,
  TestimonialController.create,
)
testimonialsRouter.patch(
  '/:id',
  validateTestimonialUpdate,
  errorHandler,
  TestimonialController.update,
)
testimonialsRouter.delete(
  '/:id',
  validateIdAndTestimonialExistence,
  TestimonialController.delete,
)

export default testimonialsRouter
