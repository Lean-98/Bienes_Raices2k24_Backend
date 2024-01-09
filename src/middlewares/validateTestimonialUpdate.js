import { validate as validateUUID } from 'uuid'
import { ValidationError } from './ValidationError.js'
import { testimonialSchema } from '../schemas/testimonials.js'
import { TestimonialModel } from '../models/testimonial.js'

/*
  El middleware `ValidateTestimonialUpdate` 
  realiza validaciones detalladas sobre la solicitud y utiliza la biblioteca `Zod`
  para definir y validar el esquema de los datos. Incluye verificación del formato
  de UUID, consulta a la base de datos y reglas específicas
  para cada campo. En caso de errores, utiliza un error personalizado (`ValidationError`)
  para proporcionar mensajes detallados sobre la validación.
*/

export const validateTestimonialUpdate = async (req, res, next) => {
  try {
    const { id } = req.params

    // Validar el formato del UUID antes de la consulta a la base de datos
    if (!validateUUID(id)) {
      throw new ValidationError([
        { message: 'Invalid Testimonial UUID format' },
      ])
    }

    const testimonial = await TestimonialModel.find({ id })

    if (!testimonial) {
      throw new ValidationError([
        {
          message:
            'Invalid UUID: Testimonial ID does not exist in the database',
        },
      ])
    }

    const inputData = req.body

    // Validar el cuerpo de la solicitud con el schema de Zod de forma asincrónica
    testimonialSchema.parse(inputData)

    // Si la validación es exitosa, asigna los datos validados a req.validatedInput
    req.validatedInput = inputData

    next()
  } catch (error) {
    next(error) // Pasar el error al errorHandler para su manejo
  }
}
