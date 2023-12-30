import { VendorModel } from '../models/vendor.js'
import { validate } from 'uuid'

export class VendorController {
  static async getAll(req, res) {
    try {
      const vendors = await VendorModel.getAll()
      res.json(vendors)
    } catch (error) {
      res.status(500).json({
        message: 'Something goes wrong',
      })
    }
  }

  static async getById(req, res) {
    const { id } = req.params
    if (!validate(id)) {
      return res.status(400).json({
        message: 'Invalid ID format',
      })
    }

    const vendor = await VendorModel.getById({ id })

    if (!vendor)
      return res.status(404).json({
        message: 'Vendor not found',
      })

    res.send(vendor)
  }

  static async create(req, res) {
    const input = req.body
    try {
      const newVendor = await VendorModel.create({ input })
      res.status(201).json(newVendor)
    } catch (error) {
      res.status(500).json({
        message: 'Something goes wrong',
      })
    }
  }

  static async update(req, res) {
    const { id } = req.params
    const input = req.body

    if (!validate(id)) {
      return res.status(400).json({
        message: 'Invalid ID format',
      })
    }

    const { updatedVendor, result } = await VendorModel.update({ id, input })

    if (result.affectedRows === 0)
      return res.status(404).json({
        message: 'Vendor not found',
      })

    res.json(updatedVendor)
  }

  static async delete(req, res) {
    const { id } = req.params

    if (!validate(id)) {
      return res.status(400).json({
        message: 'Invalid ID format',
      })
    }

    const { result } = await VendorModel.delete({ id })

    if (result.affectedRows === 0)
      return res.status(404).json({
        message: 'Vendor not found',
      })
    res.sendStatus(204)
  }
}
