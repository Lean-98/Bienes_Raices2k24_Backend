import { pool } from '../db.js'

export class TestimonialModel {
  static async getAll() {
    try {
      const [rows] = await pool.query(
        'SELECT BIN_TO_UUID(id) id, author, content FROM testimonials',
      )
      return [rows]
    } catch (error) {
      throw new Error('Error when obtaining testimonials')
    }
  }

  static async getById({ id }) {
    try {
      const [rows] = await pool.query(
        'SELECT BIN_TO_UUID(id) id, author, content FROM testimonials WHERE id = UUID_TO_BIN(?)',
        [id],
      )
      return rows[0]
    } catch (error) {
      throw new Error('Error when obtaining id')
    }
  }

  static async create({ input }) {
    const { author, content } = input

    try {
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
    } catch (error) {
      throw new Error('Error creating testimonial')
    }
  }

  static async update({ id, input }) {
    const { author, content } = input

    try {
      const [result] = await pool.query(
        'UPDATE testimonials SET author = IFNULL(?, author), content = IFNULL(?, content) WHERE id = UUID_TO_BIN(?)',
        [author, content, id],
      )

      const [updatedTestimonial] = await pool.query(
        'SELECT BIN_TO_UUID(id) id, author, content FROM testimonials WHERE id = UUID_TO_BIN(?)',
        [id],
      )

      return { updatedTestimonial, result }
    } catch (error) {
      throw new Error('Error updating testimonial')
    }
  }

  static async delete({ id }) {
    try {
      const [result] = await pool.query(
        'DELETE from testimonials WHERE id = UUID_TO_BIN(?)',
        [id],
      )
      return { result }
    } catch (error) {
      throw new Error('Error deleting testimonial')
    }
  }
}
