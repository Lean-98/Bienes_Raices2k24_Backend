import { PropertyModel } from '../models/property.js'
import { DB_HOST, PORT } from '../config.js'
import path from 'node:path'

export class PropertyController {
  static async getAll(req, res) {
    try {
      const properties = await PropertyModel.getAll()
      res.json(properties)
    } catch (err) {
      console.error('Error when obtaining Properties:', err)
      res.status(500).json({
        message: 'Internal server error',
      })
    }
  }

  static async getById(req, res) {
    const { id } = req.params

    try {
      const property = await PropertyModel.getById({ id })

      if (!property)
        return res.status(404).json({
          message: 'Property not found',
        })

      res.send(property)
    } catch (err) {
      console.error('Error when obtaining Property:', err)
      res.status(500).json({
        message: 'Internal server error',
      })
    }
  }

  static async create(req, res) {
    const input = req.validatedInput

    try {
      if (!req.files || req.files.length === 0)
        return res.status(400).json({
          message: 'At least one file upload is required',
        })

      // Convierte el FileList(Formik) en un array de archivos
      const files = Array.from(req.files)

      const imagePaths = files.map(file => {
        const fileName = path.basename(file.path)
        const imagePath = `http://${DB_HOST}:${PORT}/public/${fileName}`
        return imagePath
      })

      const newProperties = await PropertyModel.create({
        input,
        imagePaths,
      })

      res.status(201).json(newProperties)
    } catch (err) {
      console.error('Error creating Property:', err)
      res.status(500).json({
        message: 'Internal server error',
      })
    }
  }

  static async update(req, res) {
    const { id } = req.params
    const input = req.validatedInput

    try {
      // Convierte el FileList(Formik) en un array de archivos
      const files = Array.from(req.files)
      const imagePaths = files.map(file => {
        const fileName = path.basename(file.path)
        const imagePath = `http://${DB_HOST}:${PORT}/public/${fileName}`
        return imagePath
      })

      const { result, updatedProperty } = await PropertyModel.update({
        id,
        input,
        imagePaths,
      })

      if (result.affectedRows === 0)
        return res.status(404).json({
          message: 'Property not found',
        })

      res.json(updatedProperty[0])
    } catch (err) {
      console.error('Error updating Property:', err)
      res.status(500).json({
        message: 'Internal server error',
      })
    }
  }

  static async delete(req, res) {
    const { id } = req.params

    try {
      const { result } = await PropertyModel.delete({ id })

      if (result.affectedRows <= 0)
        return res.status(404).json({
          message: 'Property not found',
        })

      res.sendStatus(204)
    } catch (err) {
      console.error('Error when deleting a Property:', err)
      res.status(500).json({
        message: 'Internal server error',
      })
    }
  }
}
