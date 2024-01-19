import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config.js'

export const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')
  const secretKey = JWT_SECRET

  if (!token) {
    console.log('No se proporcionó token en la solicitud.')
    return res
      .status(401)
      .json({ message: 'Access denied. No token provided.' })
  }

  // console.log('Token recibido en el servidor:', token)

  // Extraer el token sin el prefijo 'Bearer'
  const tokenWithoutBearer = token.replace('Bearer ', '')

  try {
    const decoded = jwt.verify(tokenWithoutBearer, secretKey)
    req.user = decoded
    // console.log('Token verificado con éxito:', decoded)
    next()
  } catch (error) {
    console.error('Error al verificar el token:', error)
    res.status(401).json({ message: 'Invalid token', error: error.message })
  }
}
