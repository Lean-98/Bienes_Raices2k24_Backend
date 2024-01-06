import fs from 'node:fs/promises'
import path, { join } from 'node:path'
import { pool } from '../db.js'
import { CURRENT_DIR } from '../multerconfig.js'

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

  static async find({ id }) {
    try {
      const [rows] = await pool.query(
        'SELECT BIN_TO_UUID(id) id FROM properties WHERE id = UUID_TO_BIN(?)',
        [id],
      )
      return rows[0]
    } catch (error) {
      throw new Error('Error when obtaining property')
    }
  }

  static async create({ input, imagePath }) {
    const {
      title,
      price,
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
        'SELECT id FROM vendors WHERE id = UUID_TO_BIN(?)',
        [vendor_id],
      )

      if (!vendor) {
        throw new Error('Vendor UUID not found')
      }

      // ID creation
      const [uuidResult] = await pool.query('SELECT UUID() id')
      const [{ id }] = uuidResult
      const [rows] = await pool.query(
        `INSERT INTO properties (id, title, price, description, bedrooms, baths, garage, created, vendor_id, image) VALUES (UUID_TO_BIN("${id}"),?, ?, ?, ?, ?, ?, ?, UUID_TO_BIN(?), ?)`,
        [
          title,
          price,
          description,
          bedrooms,
          baths,
          garage,
          created,
          vendor_id,
          imagePath,
        ],
      )

      const newProperty = {
        id,
        ...input,
        image: imagePath,
      }

      return newProperty
    } catch (error) {
      throw new Error('Error creating property')
    }
  }

  static async update({ id, input, imagePath }) {
    const {
      title,
      price,
      description,
      bedrooms,
      baths,
      garage,
      created,
      vendor_id,
    } = input

    // Convertir el UUID a BINARY(16)
    const vendor_id_bin = Buffer.from(vendor_id.replace(/-/g, ''), 'hex')

    // Verificar si vendor_id existe en la BD
    const [vendor] = await pool.query(
      'SELECT id FROM vendors WHERE id = UUID_TO_BIN(?)',
      [vendor_id],
    )

    if (!vendor) {
      throw new Error('vendor_id does not exist in the DB')
    }

    // Obtener la imagen actual
    const [currentImageRow] = await pool.query(
      'SELECT image FROM properties WHERE id = UUID_TO_BIN(?)',
      [id],
    )

    // Si la imagen actual existe, eliminarla
    if (currentImageRow.length > 0) {
      const currentImagePath = path.join(
        CURRENT_DIR,
        '../uploads',
        path.basename(currentImageRow[0].image),
      )
      console.log(currentImagePath)
      try {
        await fs.unlink(currentImagePath)
      } catch (error) {
        console.error(`Failed to delete file: ${currentImagePath}`)
      }
    }

    const [result] = await pool.query(
      'UPDATE properties SET title = IFNULL(?, title), price = IFNULL(?, price), image = IFNULL(?, image), description = IFNULL(?, description), bedrooms = IFNULL(?, bedrooms), baths = IFNULL(?, baths), garage = IFNULL(?, garage), created = IFNULL(?, created), vendor_id = IFNULL(?, vendor_id) WHERE id = UUID_TO_BIN(?)',
      [
        title,
        price,
        imagePath,
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
      const [image] = await pool.query(
        'SELECT image FROM properties WHERE id = UUID_TO_BIN(?)',
        [id],
      )

      const [result] = await pool.query(
        'DELETE FROM properties WHERE id = UUID_TO_BIN(?)',
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
      throw new Error('Error deleting property')
    }
  }
}
