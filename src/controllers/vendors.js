import { VendorModel } from '../models/vendor.js'
import { DB_HOST, PORT } from '../config.js'
import path from 'node:path'

export class VendorController {
  static async getAll(req, res) {
    const vendors = await VendorModel.getAll()
    res.json(vendors)
  }

  static async getById(req, res) {
    const { id } = req.params

    const vendor = await VendorModel.getById({ id })

    if (!vendor)
      return res.status(404).json({
        message: 'Vendor not found',
      })

    res.send(vendor)
  }

  static async create(req, res) {
    const input = req.validatedInput
    // Obténer solo el nombre del archivo de la ruta
    const fileName = path.basename(req.file.path)
    // Agrega la ruta de la imagen al host del SV
    const imagePath = `http://${DB_HOST}:${PORT}/public/${fileName}`
    // console.log(imagePath)

    const newVendor = await VendorModel.create({ input, imagePath })

    res.status(201).json(newVendor)
  }

  static async update(req, res) {
    const { id } = req.params
    const input = req.validatedInput

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
  }

  static async delete(req, res) {
    const { id } = req.params

    const { result } = await VendorModel.delete({ id })

    if (result.affectedRows === 0)
      return res.status(404).json({
        message: 'Vendor not found',
      })

    res.sendStatus(204)
  }
}
