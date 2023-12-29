import { Router } from "express";
import { TestimonialController } from "../controllers/testimonials.js";

const testimonialesRouter = Router()

// Controllers
testimonialesRouter.get('/', TestimonialController.getAll)
testimonialesRouter.get('/:id', TestimonialController.getById)
testimonialesRouter.post('/', TestimonialController.create)
testimonialesRouter.patch('/:id', TestimonialController.update)//TODO
testimonialesRouter.delete('/:id', TestimonialController.delete)


export default testimonialesRouter