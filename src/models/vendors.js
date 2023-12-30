import { pool } from '../db.js'

export class VendorsModel {
  static async getAll() {
    try {
      const [rows] = await pool.query(
        'SELECT BIN_TO_UUID(id) id, name, surname, phone, email, image FROM vendors',
      )
      return rows
    } catch (error) {
      throw new Error('Error when obtaining vendors')
    }
  }

  static async getById({ id }) {
    try {
      const [rows] = await pool.query(
        'SELECT BIN_TO_UUID(id) id, name, surname, phone, email, image FROM vendors WHERE id = UUID_TO_BIN(?)',
        [id],
      )
      return rows[0]
    } catch (error) {
      throw new Error('Error when obtaining id')
    }
  }

  static async create({ input }) {
    const { name, surname, phone, email, image } = input
    try {
      // ID creation
      const [uuidResult] = await pool.query('SELECT UUID() id')
      const [{ id }] = uuidResult

      const [rows] = await pool.query(
        `INSERT INTO vendors(id, name, surname, phone, email, image) VALUES (UUID_TO_BIN("${id}"),?, ?, ?, ?, ?)`,
        [id, name, surname, phone, email, image],
      )

      const newVendor = {
        id,
        ...input,
      }

      return newVendor
    } catch (error) {
      throw new Error('Error creating vendor')
    }
  }

  static async update({ id, input }) {
    const { name, surname, phone, email, image } = input

    try {
      const [result] = await pool.query(
        'UPDATE vendors SET name = IFNULL(?, name), surname = IFNULL(?, surname), phone = IFNULL(?, phone), email = IFNULL(?, email), image = IFNULL(?, image) WHERE id = UUID_TO_BIN(?)',
        [name, surname, phone, email, image, id],
      )

      const [updatedVendor] = await pool.query(
        'SELECT BIN_TO_UUID(id) id, name, surname, phone, email, image FROM vendors WHERE id = UUID_TO_BIN(?)',
        [id],
      )

      return { result, updatedVendor }
    } catch (error) {
      throw new Error('Error updating vendor')
    }
  }

  static async delete({ id }) {
    try {
      const [result] = await pool.query(
        'DELETE FROM vendors WHERE id = UUID_TO_BIN(?)',
        [id],
      )
      return result
    } catch (error) {
      throw new Error('Error deleting vendor')
    }
  }
}
