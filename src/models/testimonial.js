import { pool } from '../db.js'

export class TestimonialModel {
  static async getAll() {
    const [rows] = await pool.query(
      'SELECT BIN_TO_UUID(id) id, author, content FROM testimonials',
    )
    return [rows]
  }

  static async getById({ id }) {
    const [rows] = await pool.query(
      'SELECT BIN_TO_UUID(id) id, author, content FROM testimonials WHERE id = UUID_TO_BIN(?)',
      [id],
    )
    return rows[0]
  }

  static async find({ id }) {
    const [rows] = await pool.query(
      'SELECT BIN_TO_UUID(id) id FROM testimonials WHERE id = UUID_TO_BIN(?)',
      [id],
    )
    return rows[0]
  }

  static async create({ input }) {
    const { author, content } = input

    // ID creation
    const [uuidResult] = await pool.query('SELECT UUID() id')
    const [{ id }] = uuidResult

    const [rows] = await pool.query(
      `INSERT INTO testimonials (id, author, content) VALUES (UUID_TO_BIN("${id}"),?, ?)`,
      [author, content],
    )

    const newTestimonial = {
      id,
      ...input,
    }

    return newTestimonial
  }

  static async update({ id, input }) {
    const { author, content } = input

    const [result] = await pool.query(
      'UPDATE testimonials SET author = IFNULL(?, author), content = IFNULL(?, content) WHERE id = UUID_TO_BIN(?)',
      [author, content, id],
    )

    const [updatedTestimonial] = await pool.query(
      'SELECT BIN_TO_UUID(id) id, author, content FROM testimonials WHERE id = UUID_TO_BIN(?)',
      [id],
    )

    return { updatedTestimonial, result }
  }

  static async delete({ id }) {
    const [result] = await pool.query(
      'DELETE from testimonials WHERE id = UUID_TO_BIN(?)',
      [id],
    )

    return { result }
  }
}
