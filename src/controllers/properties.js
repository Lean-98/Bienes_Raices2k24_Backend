import { PropertyModel } from '../models/property.js'
import { validate } from 'uuid'

export class PropertyController {
  static async getAll(req, res) {
    try {
      const properties = await PropertyModel.getAll()
      res.json(properties)
    } catch (error) {
      return res.status(500).json({
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
    const property = await PropertyModel.getById({ id })
    if (!property)
      return res.status(404).json({
        message: 'Property not found',
      })
    res.send(property)
  }

  static async create(req, res) {
    const input = req.body

    const newProperty = await PropertyModel.create({ input })

    res.status(201).json(newProperty)
  }

  static async update(req, res) {
    const { id } = req.params
    const input = req.body

    if (!validate(id)) {
      return res.status(400).json({
        message: 'Invalid ID format',
      })
    }

    const { result, updatedProperty } = await PropertyModel.update({
      id,
      input,
    })

    if (result.affectedRows === 0)
      return res.status(404).json({
        message: 'Property not found',
      })

    res.json(updatedProperty[0])
  }

  static async delete(req, res) {
    const { id } = req.params
    if (!validate(id)) {
      return res.status(400).json({
        message: 'Invalid ID format',
      })
    }

    const { result } = await PropertyModel.delete({ id })
    // console.log(result.affectedRows)
    
    if (result.affectedRows <= 0)
      return res.status(404).json({
        message: 'Property not found',
      })
    res.sendStatus(204)
  }
}
