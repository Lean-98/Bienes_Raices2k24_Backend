import { VendorsModel } from '../models/vendors.js'
import { validatorUUID } from '../utils/validatoruuid.js'

export class VendorController {
  static async getAll(req, res) {
    try {
      const vendors = await VendorsModel.getAll()
      res.json(vendors)
    } catch (error) {
      res.status(500).json({
        message: 'Something goes wrong',
      })
    }
  }

  static async getById(req, res) {
    const { id } = req.params
    if (!validatorUUID(id)) {
      return res.status(400).json({
        message: 'Invalid ID format',
      })
    }

    const vendor = await VendorsModel.getById({ id })

    if (!vendor)
      return res.status(404).json({
        message: 'Vendedor not found',
      })

    res.send(vendor)
  }

  static async create(req, res) {
    const input = req.body
    try {
      const newVendor = await VendorsModel.create({ input })
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

    if (!validatorUUID(id)) {
      return res.status(400).json({
        message: 'Invalid ID format',
      })
    }

    const { updatedVendor, result } = await VendorsModel.update({ id, input })

    if (result.affectedRows === 0)
      return res.status(404).json({
        message: 'Vendedor not found',
      })

    res.json(updatedVendor)
  }

  static async delete(req, res) {
    const { id } = req.params

    if (!validatorUUID(id)) {
      return res.status(400).json({
        message: 'Invalid ID format',
      })
    }

    const result = await VendorsModel.delete({ id })

    if (result.affectedRows === 0)
      return res.status(404).json({
        message: 'Vendedor not found',
      })
    res.sendStatus(204)
  }
}
