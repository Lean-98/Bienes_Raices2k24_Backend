import { AuthModel } from '../models/auth.js'

export class AuthController {
  static async loginAdmin(req, res) {
    const { email, password } = req.body

    const user = await AuthModel.findByEmail(email)

    if (user && (await AuthModel.validPassword(password, user.pword))) {
      req.session.user = user
      res.redirect('/admin')
    } else {
      res.redirect('/login')
    }
  }

  static async create(req, res) {
    const input = req.validatedInput

    const newUser = await AuthModel.create({ input })
    res.status(201).json(newUser)
  }
}
