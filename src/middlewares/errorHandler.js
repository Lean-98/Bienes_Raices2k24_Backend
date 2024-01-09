import { z } from 'zod'
import { ValidationError } from './ValidationError.js'

// Middleware para manejar errores de validación y otros errores
export const errorHandler = (error, req, res, next) => {
  if (error instanceof ValidationError) {
    res.status(400).json({ error: error.message, details: error.errors })
  } else if (error instanceof z.ZodError) {
    const detailedErrors = error.errors.map(e => ({
      path: e.path.join('.'),
      message: e.message,
    }))
    res.status(400).json({ error: 'Validation error', details: detailedErrors })
  } else {
    res
      .status(500)
      .json({ error: 'Internal server error', details: error.message })
  }
}
