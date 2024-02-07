import fs from 'node:fs/promises'
import path, { join } from 'node:path'
import { pool } from '../db.js'
import { CURRENT_DIR } from '../middlewares/multerConfig.js'

export class PropertyModel {
  static async getAll() {
    const [rows] = await pool.query(
      'SELECT BIN_TO_UUID(id) id, title, price, image, description, bedrooms, baths, garage, created,  BIN_TO_UUID(vendor_id) vendor_id FROM properties',
    )
    return rows
  }

  static async getById({ id }) {
    const [rows] = await pool.query(
      'SELECT BIN_TO_UUID(id) id, title, price, image, description, bedrooms, baths, garage, created, BIN_TO_UUID(vendor_id) vendor_id FROM properties WHERE id = UUID_TO_BIN(?)',
      [id],
    )
    return rows
  }

  static async find({ id }) {
    const [rows] = await pool.query(
      'SELECT BIN_TO_UUID(id) id FROM properties WHERE id = UUID_TO_BIN(?)',
      [id],
    )
    return rows[0]
  }

  static async create({ input, imagePaths }) {
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

    // ID creation
    const [uuidResult] = await pool.query('SELECT UUID() id')
    const [{ id }] = uuidResult

    // Insertar la propiedad con todas las imágenes
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
        imagePaths.map(imagePath => imagePath).join(','), // Concatenar las imagenes  en cadenas separada por comas
      ],
    )

    const newProperty = {
      id,
      ...input,
      image: imagePaths,
    }

    return newProperty
  }

  static async update({ id, input, imagePaths }) {
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

    // Obtener la imagen actual
    const [currentImagesRow] = await pool.query(
      'SELECT image FROM properties WHERE id = UUID_TO_BIN(?)',
      [id],
    )

    // Convertir la cadena de nombres de archivo a un array de strings
    if (imagePaths.length > 0) {
      const currentImagePaths =
        currentImagesRow.length > 0 ? currentImagesRow[0].image.split(',') : []

      console.log('Current image paths to delete:', currentImagePaths)

      // Resto del código para eliminar las imágenes actuales
      try {
        await Promise.all(
          currentImagePaths.map(async fileName => {
            const imagePath = path.join(CURRENT_DIR, '../../uploads', fileName)
            await fs.unlink(imagePath)
            console.log('File deleted successfully:', imagePath)
          }),
        )
      } catch (error) {
        console.error('Failed to delete files:', currentImagePaths)
        console.error('Error details:', error.message)
        console.error('Error stack:', error.stack)
      }
    }
    const [result] = await pool.query(
      'UPDATE properties SET title = IFNULL(?, title), price = IFNULL(?, price), image = IFNULL(?, image), description = IFNULL(?, description), bedrooms = IFNULL(?, bedrooms), baths = IFNULL(?, baths), garage = IFNULL(?, garage), created = IFNULL(?, created), vendor_id = IFNULL(?, vendor_id) WHERE id = UUID_TO_BIN(?)',
      [
        title,
        price,
        // Almacena solo los nombres de archivo
        imagePaths.map(imagePath => imagePath).join(','), // Concatenar las imagenes  en cadenas separada por comas
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
    // Obtener la información de la imagen antes de eliminar la propiedad
    const [imageRow] = await pool.query(
      'SELECT image FROM properties WHERE id = UUID_TO_BIN(?)',
      [id],
    )

    // Eliminar la propiedad por ID
    const [result] = await pool.query(
      'DELETE FROM properties WHERE id = UUID_TO_BIN(?)',
      [id],
    )

    // Verificar si se encontró una imagen asociada a la propiedad
    if (imageRow.length > 0) {
      // Iterar sobre cada ruta de imagen y eliminarla por separado
      const imagePaths = imageRow[0].image.split(',')

      await Promise.all(
        imagePaths.map(async imageName => {
          // Construir la ruta completa de la imagen en el servidor
          const imagePath = join(
            CURRENT_DIR,
            '../../uploads',
            path.basename(imageName),
          )

          // Eliminar la imagen asociada a la propiedad
          try {
            await fs.unlink(imagePath)
            console.log('Image deleted successfully:', imagePath)
          } catch (error) {
            console.error('Failed to delete image:', imagePath)
            console.error('Error details:', error.message)
            console.error('Error stack:', error.stack)
          }
        }),
      )
    } else {
      console.log('No image found for the specified property.')
    }

    return { result, image: imageRow }
  }
}
