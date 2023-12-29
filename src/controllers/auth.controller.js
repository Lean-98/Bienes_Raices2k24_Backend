import { pool } from '../db.js'
import { response } from 'express'
import bcrypt from 'bcrypt'
// import User from '../models/User'
import { generateJWT } from '../helpers/jwt.js'

export const loginAdmin = async (req, res = response) => {
  const { email, password } = req.body

  try {
    const user = await pool.findOne({ email })

    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: 'El usuario no existe con ese email',
      })
    }

    // Confirmar los Passwords
    const validPasswords = bcrypt.compareSync(password, user.password)

    if (!validPasswords) {
      return res.status(400).json({
        ok: 'false',
        msg: 'Password Incorrecto',
      })
    }

    // Generar JWT
    const token = await generateJWT(user.id, user.name)

    res.json({
      ok: true,
      uid: user.id,
      name: user.name,
      token,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador',
    })
  }
}
