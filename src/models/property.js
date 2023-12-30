import { pool } from '../db.js'
import { validate } from 'uuid'

export class PropertyModel {
  static async getAll() {
    try {
      const [rows] = await pool.query(
        'SELECT BIN_TO_UUID(id) id, title, price, image, description, bedrooms, baths, garage, created,  BIN_TO_UUID(vendor_id) vendor_id FROM properties',
      )
      return rows
    } catch (error) {
      throw new Error('Error when obtaining properties')
    }
  }

  static async getById({ id }) {
    try {
      const [rows] = await pool.query(
        'SELECT BIN_TO_UUID(id) id, title, price, image, description, bedrooms, baths, garage, created, BIN_TO_UUID(vendor_id) vendor_id FROM properties WHERE id = UUID_TO_BIN(?)',
        [id],
      )
      return rows
    } catch (error) {
      throw new Error('Error when obtaining id')
    }
  }

  static async create({ input }) {
    const {
      title,
      price,
      image,
      description,
      bedrooms,
      baths,
      garage,
      created,
      vendor_id,
    } = input

    try {
      // Verificar si el vendor_id existe en la tabla vendors
      const [vendor] = await pool.query(
        'SELECT * FROM vendors WHERE id = UUID_TO_BIN(?)',
        [vendor_id],
      )

      if (!vendor) {
        throw new Error('Vendor ID no existe')
      }

      // Verificar si vendor_id es un UUID válido
      if (!validate(vendor_id)) {
        throw new Error('vendor_id is not a valid UUID')
      }

      // ID creation
      const [uuidResult] = await pool.query('SELECT UUID() id')
      const [{ id }] = uuidResult
      const [rows] = await pool.query(
        `INSERT INTO properties (id, title, price, image, description, bedrooms, baths, garage, created, vendor_id) VALUES (UUID_TO_BIN("${id}"),?, ?, ?, ?, ?, ?, ?, ?, UUID_TO_BIN(?))`,
        [
          title,
          price,
          image,
          description,
          bedrooms,
          baths,
          garage,
          created,
          vendor_id,
        ],
      )

      const newProperty = {
        id,
        ...input,
      }

      return newProperty
    } catch (error) {
      throw new Error('Error creating property')
    }
  }

  static async update({ id, input }) {
    const {
      title,
      price,
      image,
      description,
      bedrooms,
      baths,
      garage,
      created,
      vendor_id,
    } = input

    // Convertir el UUID a BINARY(16)
    const vendor_id_bin = Buffer.from(vendor_id.replace(/-/g, ''), 'hex')

    // Verificar si vendor_id es un UUID válido
    if (!validate(vendor_id)) {
      throw new Error('vendor_id is not a valid UUID')
    }

    // Verificar si vendor_id existe en la BD
    const [vendor] = await pool.query(
      'SELECT id FROM vendors WHERE id = UUID_TO_BIN(?)',
      [vendor_id],
    )
    if (!vendor) {
      throw new Error('vendor_id does not exist in the DB')
    }

    const [result] = await pool.query(
      'UPDATE properties SET title = IFNULL(?, title), price = IFNULL(?, price), image = IFNULL(?, image), description = IFNULL(?, description), bedrooms = IFNULL(?, bedrooms), baths = IFNULL(?, baths), garage = IFNULL(?, garage), created = IFNULL(?, created), vendor_id = IFNULL(?, vendor_id) WHERE id = UUID_TO_BIN(?)',
      [
        title,
        price,
        image,
        description,
        bedrooms,
        baths,
        garage,
        created,
        vendor_id_bin,
        id,
      ],
    )

    const [updatedProperty] = await pool.query(
      'SELECT  BIN_TO_UUID(id) id, title, price, image, description, bedrooms, baths, garage, created,  BIN_TO_UUID(vendor_id) vendor_id FROM properties WHERE id = UUID_TO_BIN(?)',
      [id],
    )

    return { result, updatedProperty }
  }

  static async delete({ id }) {
    try {
      const [result] = await pool.query(
        'DELETE FROM properties WHERE id = UUID_TO_BIN(?)',
        [id],
      )
      return { result }
    } catch (error) {
      throw new Error('Error deleting property')
    }
  }
}
