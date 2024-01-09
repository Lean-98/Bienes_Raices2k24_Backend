import fs from 'node:fs/promises'
import path, { join } from 'node:path'
import { pool } from '../db.js'
import { CURRENT_DIR } from '../middlewares/multerConfig.js'

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

  static async find({ id }) {
    try {
      const [rows] = await pool.query(
        'SELECT BIN_TO_UUID(id) id FROM blogs WHERE id = UUID_TO_BIN(?)',
        [id],
      )
      return rows[0]
    } catch (error) {
      throw new Error('Error when obtaining blog')
    }
  }

  static async create({ input, imagePath }) {
    const { title, created, author, content } = input
    try {
      // ID creation
      const [uuidResult] = await pool.query('SELECT UUID() id')
      const [{ id }] = uuidResult

      const [rows] = await pool.query(
        `INSERT INTO blogs (id, title, created, author, content, image) VALUES (UUID_TO_BIN("${id}"),?, ?, ?, ?, ?)`,
        [title, created, author, content, imagePath],
      )

      const newBlog = {
        id,
        ...input,
        image: imagePath,
      }
      return newBlog
    } catch (error) {
      throw new Error('Error creating blog')
    }
  }

  static async update({ id, input, imagePath }) {
    const { title, created, author, content } = input
    try {
      // Obtener la imagen actual
      const [currentImageRow] = await pool.query(
        'SELECT image FROM blogs WHERE id = UUID_TO_BIN(?)',
        [id],
      )

      // Si la imagen actual existe, eliminarla
      if (currentImageRow.length > 0) {
        const currentImagePath = path.join(
          CURRENT_DIR,
          '../uploads',
          path.basename(currentImageRow[0].image),
        )
        // console.log(currentImagePath)
        try {
          await fs.unlink(currentImagePath)
        } catch (error) {
          console.error(`Failed to delete file: ${currentImagePath}`)
        }
      }

      const [result] = await pool.query(
        'UPDATE blogs SET title = IFNULL(?, title), created = IFNULL(?, created), author = IFNULL(?, author), content = IFNULL(?, content), image = IFNULL(?, image) WHERE id = UUID_TO_BIN(?)',
        [title, created, author, content, imagePath, id],
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
      const [image] = await pool.query(
        'SELECT image FROM blogs WHERE id = UUID_TO_BIN(?)',
        [id],
      )
      const [result] = await pool.query(
        'DELETE FROM blogs WHERE id = UUID_TO_BIN(?)',
        [id],
      )

      if (image.length > 0) {
        const nameImageDb = image[0].image
        const nameImage = nameImageDb.substring(
          nameImageDb.lastIndexOf('/') + 1,
        )
        // console.log('Image name:', nameImage)
        const routeImage = join(CURRENT_DIR, '../uploads', nameImage)

        fs.unlink(routeImage, err => {
          if (err) {
            console.error('There was an error deleting the file:', err)
          } else {
            console.log('File deleted successfully')
          }
        })
      } else {
        console.log('The image with the specified name was not found')
      }

      return { result, image }
    } catch (error) {
      throw new Error('Error deleting blog')
    }
  }
}
