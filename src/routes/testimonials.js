import { Router } from 'express'
import { TestimonialController } from '../controllers/testimonials.js'

const testimonialsRouter = Router()

testimonialsRouter.get('/', TestimonialController.getAll)
testimonialsRouter.get('/:id', TestimonialController.getById)
testimonialsRouter.post('/', TestimonialController.create)
testimonialsRouter.patch('/:id', TestimonialController.update)
testimonialsRouter.delete('/:id', TestimonialController.delete)

export default testimonialsRouter
