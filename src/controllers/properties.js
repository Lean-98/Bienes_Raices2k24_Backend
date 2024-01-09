import { PropertyModel } from '../models/property.js'
import { DB_HOST, PORT } from '../config.js'
import path from 'node:path'

export class PropertyController {
  static async getAll(req, res) {
    const properties = await PropertyModel.getAll()
    res.json(properties)
  }

  static async getById(req, res) {
    const { id } = req.params
    const property = await PropertyModel.getById({ id })

    if (!property)
      return res.status(404).json({
        message: 'Property not found',
      })

    res.send(property)
  }

  static async create(req, res) {
    const input = req.validatedInput

    // Obténer solo el nombre del archivo de la ruta
    const fileName = path.basename(req.file.path)
    // Agrega la ruta de la imagen al host del SV
    const imagePath = `http://${DB_HOST}:${PORT}/public/${fileName}`

    const newProperty = await PropertyModel.create({
      input,
      imagePath,
    })

    res.status(201).json(newProperty)
  }

  static async update(req, res) {
    const { id } = req.params
    const input = req.validatedInput

    // Obténer solo el nombre del archivo de la ruta
    const fileName = path.basename(req.file.path)
    // Agrega la ruta de la imagen al host del SV
    const imagePath = `http://${DB_HOST}:${PORT}/public/${fileName}`

    const { result, updatedProperty } = await PropertyModel.update({
      id,
      input,
      imagePath,
    })

    if (result.affectedRows === 0)
      return res.status(404).json({
        message: 'Property not found',
      })

    res.json(updatedProperty[0])
  }

  static async delete(req, res) {
    const { id } = req.params

    const { result } = await PropertyModel.delete({ id })

    if (result.affectedRows <= 0)
      return res.status(404).json({
        message: 'Property not found',
      })

    res.sendStatus(204)
  }
}
