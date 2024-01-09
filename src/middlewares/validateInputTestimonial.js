import { testimonialSchema } from '../schemas/testimonials.js'

/*
  El middleware `ValidateInputTestimonial` 
  realiza validaciones detalladas sobre la solicitud y utiliza la biblioteca `Zod`
  para definir y validar el esquema de los datos con las reglas específicas
  para cada campo. En caso de errores, utiliza un error personalizado (`ValidationError`)
  para proporcionar mensajes detallados sobre la validación. 
*/

export const validateInputTestimonial = async (req, res, next) => {
  try {
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
