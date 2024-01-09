import fs from 'node:fs/promises'
import path, { join } from 'node:path'
import { pool } from '../db.js'
import { CURRENT_DIR } from '../middlewares/multerConfig.js'

export class VendorModel {
  static async getAll() {
    const [rows] = await pool.query(
      'SELECT BIN_TO_UUID(id) id, name, surname, phone, email, image FROM vendors',
    )
    return rows
  }

  static async getById({ id }) {
    const [rows] = await pool.query(
      'SELECT BIN_TO_UUID(id) id, name, surname, phone, email, image FROM vendors WHERE id = UUID_TO_BIN(?)',
      [id],
    )
    return rows[0]
  }

  static async find({ id }) {
    const [rows] = await pool.query(
      'SELECT BIN_TO_UUID(id) id FROM vendors WHERE id = UUID_TO_BIN(?)',
      [id],
    )
    return rows[0]
  }

  static async create({ input, imagePath }) {
    const { name, surname, phone, email } = input

    // ID creation
    const [uuidResult] = await pool.query('SELECT UUID() id')
    const [{ id }] = uuidResult

    const [rows] = await pool.query(
      `INSERT INTO vendors (id, name, surname, phone, email, image) VALUES (UUID_TO_BIN("${id}"), ?, ?, ?, ?, ?)`,
      [name, surname, phone, email, imagePath],
    )

    const newVendor = {
      id,
      ...input,
      image: imagePath,
    }

    return newVendor
  }

  static async update({ id, input, imagePath }) {
    const { name, surname, phone, email } = input

    // Obtener la imagen actual
    const [currentImageRow] = await pool.query(
      'SELECT image FROM vendors WHERE id = UUID_TO_BIN(?)',
      [id],
    )

    // Si la imagen actual existe, eliminarla
    if (currentImageRow.length > 0) {
      const currentImagePath = path.join(
        CURRENT_DIR,
        '../../uploads',
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
      'UPDATE vendors SET name = IFNULL(?, name), surname = IFNULL(?, surname), phone = IFNULL(?, phone), email = IFNULL(?, email), image = IFNULL(?, image) WHERE id = UUID_TO_BIN(?)',
      [name, surname, phone, email, imagePath, id],
    )

    const [updatedVendor] = await pool.query(
      'SELECT BIN_TO_UUID(id) id, name, surname, phone, email, image FROM vendors WHERE id = UUID_TO_BIN(?)',
      [id],
    )

    return { result, updatedVendor }
  }

  static async delete({ id }) {
    const [image] = await pool.query(
      'SELECT image FROM vendors WHERE id = UUID_TO_BIN(?)',
      [id],
    )

    const [result] = await pool.query(
      'DELETE FROM vendors WHERE id = UUID_TO_BIN(?)',
      [id],
    )
    if (image.length > 0) {
      const nameImageDb = image[0].image
      const nameImage = nameImageDb.substring(nameImageDb.lastIndexOf('/') + 1)
      // console.log('Image name:', nameImage)
      const routeImage = join(CURRENT_DIR, '../../uploads', nameImage)

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
  }
}
