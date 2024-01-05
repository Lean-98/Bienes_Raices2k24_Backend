import { validate } from 'uuid'

// Middleware para validar UUID
export const validateUUID = async (req, res, next) => {
  const { id } = req.params

  if (!validate(id)) {
    return res.status(400).json({
      message: 'Invalid UUID format',
    })
  }
  next()
}
