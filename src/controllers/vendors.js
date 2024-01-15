import { VendorModel } from '../models/vendor.js'
import { DB_HOST, PORT } from '../config.js'
import path from 'node:path'

export class VendorController {
  static async getAll(req, res) {
    try {
      const vendors = await VendorModel.getAll()
      res.json(vendors)
    } catch (err) {
      console.error('Error when obtaining Vendors:', err)
      res.status(500).json({
        message: 'Internal server error',
      })
    }
  }

  static async getById(req, res) {
    const { id } = req.params

    try {
      const vendor = await VendorModel.getById({ id })

      if (!vendor)
        return res.status(404).json({
          message: 'Vendor not found',
        })

      res.send(vendor)
    } catch (err) {
      console.error('Error when obtaining Vendor:', err)
      res.status(500).json({
        message: 'Internal server error',
      })
    }
  }

  static async create(req, res) {
    const input = req.validatedInput

    try {
      if (!req.file)
        return res.status(400).json({
          message: 'File upload is required',
        })
      // Obténer solo el nombre del archivo de la ruta
      const fileName = path.basename(req.file.path)
      // Agrega la ruta de la imagen al host del SV
      const imagePath = `http://${DB_HOST}:${PORT}/public/${fileName}`
      // console.log(imagePath)

      const newVendor = await VendorModel.create({ input, imagePath })

      res.status(201).json(newVendor)
    } catch (err) {
      console.error('Error creating Vendor:', err)
      res.status(500).json({
        message: 'Internal server error',
      })
    }
  }

  static async update(req, res) {
    const { id } = req.params
    const input = req.validatedInput

    try {
      if (!req.file)
        return res.status(400).json({
          message: 'File upload is required',
        })
      // Obténer solo el nombre del archivo de la ruta
      const fileName = path.basename(req.file.path)
      // Agrega la ruta de la imagen al host del SV
      const imagePath = `http://${DB_HOST}:${PORT}/public/${fileName}`

      const { updatedVendor, result } = await VendorModel.update({
        id,
        input,
        imagePath,
      })

      if (result.affectedRows === 0)
        return res.status(404).json({
          message: 'Vendor not found',
        })

      res.json(updatedVendor)
    } catch (err) {
      console.error('Error updating Vendor:', err)
      res.status(500).json({
        message: 'Internal server error',
      })
    }
  }

  static async delete(req, res) {
    const { id } = req.params

    try {
      const { result } = await VendorModel.delete({ id })

      if (result.affectedRows === 0)
        return res.status(404).json({
          message: 'Vendor not found',
        })

      res.sendStatus(204)
    } catch (err) {
      console.error('Error when deleting a Vendor:', err)
      res.status(500).json({
        message: 'Internal server error',
      })
    }
  }
}
