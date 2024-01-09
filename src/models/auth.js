import { pool } from '../db.js'
import bcrypt from 'bcrypt'

export class AuthModel {
  static async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT email, pword, role FROM users WHERE email = ?',
      [email],
    )
    if (rows.length > 0) {
      return rows[0]
    }
    return null
  }

  static async validPassword(password, hash) {
    return await bcrypt.compare(password, hash)
  }

  static async create({ input }) {
    const { id, email, pword, role } = input
    const saltRounds = 7
    const hashedPword = bcrypt.hashSync(pword, saltRounds)

    const [rows] = await pool.query(
      'INSERT INTO users (id, email, pword, role) VALUES (?, ?, ?, ?)',
      [id, email, hashedPword, role],
    )

    const newUser = {
      ...input,
      pword: hashedPword,
    }
    return newUser
  }
}
