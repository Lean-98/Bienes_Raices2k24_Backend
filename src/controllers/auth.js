import { AuthModel } from '../models/auth.js'

export class AuthController {
  static async loginAdmin(req, res) {
    const { email, password } = req.body

    try {
      const user = await AuthModel.findByEmail(email)

      if (user && (await AuthModel.validPassword(password, user.pword))) {
        req.session.user = user
        res.redirect('/admin')
      } else {
        // res.redirect('/login')
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
