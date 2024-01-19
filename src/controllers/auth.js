import { AuthModel } from '../models/auth.js'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config.js'

export class AuthController {
  static async loginAdmin(req, res) {
    const { email, password } = req.body
    const secretKey = JWT_SECRET

    try {
      const user = await AuthModel.findByEmail({ email })

      if (user && (await AuthModel.validPassword(password, user.pword))) {
        // Generar un token JWT
        const token = jwt.sign(
          { email: user.email, role: user.role },
          secretKey,
          {
            expiresIn: 60 * 60 * 24,
          },
        )

        // Enviar el token en el encabezado de la respuesta
        res.header('Authorization', 'Bearer ' + token).json({ token })
      } else {
        res.status(401).json({
          message: 'Incorrect credentials',
        })
      }
    } catch (err) {
      console.error('Error when logging in:', err)
      res.status(500).json({
        message: 'Internal server error',
      })
    }
  }

  static async create(req, res) {
    const input = req.validatedInput

    try {
      const newUser = await AuthModel.create({ input })
      res.status(201).json(newUser)
    } catch (err) {
      console.error('Error when creating an account:', err)
      res.status(500).json({
        message: 'Internal server error',
      })
    }
  }
}
