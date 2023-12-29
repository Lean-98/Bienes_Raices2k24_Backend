import { pool } from '../db.js'

export class BlogModel {
  static async getAll() {
    try {
      const [rows] = await pool.query(
        'SELECT BIN_TO_UUID(id) id, title, created, author, content, image FROM blogs',
      )
      return rows
    } catch (error) {
      throw new Error('Error when obtaining blogs')
    }
  }

  static async getById({ id }) {
    try {
      const [rows] = await pool.query(
        'SELECT BIN_TO_UUID(id) id, title, created, author, content, image FROM blogs WHERE id = UUID_TO_BIN(?)',
        [id],
      )
      return rows[0]
    } catch (error) {
      throw new Error('Error when obtaining blog')
    }
  }

  static async create({ input }) {
    const { title, created, author, content, image } = input
    try {
      // ID creation
      const [uuidResult] = await pool.query('SELECT UUID() id')
      const [{ id }] = uuidResult

      const [rows] = await pool.query(
        `INSERT INTO blogs (id, title, created, author, content, image) VALUES (UUID_TO_BIN("${id}"),?, ?, ?, ?, ?)`,
        [title, created, author, content, image],
      )

      const newBlog = {
        id,
        ...input,
      }
      return newBlog
    } catch (error) {
      throw new Error('Error creating blog')
    }
  }

  static async update({ id, input }) {
    const { title, created, author, content, image } = input
    try {
      const [result] = await pool.query(
        'UPDATE blogs SET title = IFNULL(?, title), created = IFNULL(?, created), author = IFNULL(?, author), content = IFNULL(?, content), image = IFNULL(?, image) WHERE id = UUID_TO_BIN(?)',
        [title, created, author, content, image, id],
      )

      const [rows] = await pool.query(
        'SELECT BIN_TO_UUID(id) id, title, created, author, content, image FROM blogs WHERE id = UUID_TO_BIN(?)',
        [id],
      )

      return { result, rows }
    } catch (error) {
      throw new Error('Error updating blog')
    }
  }

  static async delete({ id }) {
    try {
      const [result] = await pool.query(
        'DELETE FROM blogs WHERE id = UUID_TO_BIN(?)',
        [id],
      )
      return { result }
    } catch (error) {
      throw new Error('Error deleting blog')
    }
  }
}
