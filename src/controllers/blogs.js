import { BlogModel } from '../models/blog.js'
import { DB_HOST, PORT } from '../config.js'
import path from 'node:path'

export class BlogController {
  static async getAll(req, res) {
    try {
      const blogs = await BlogModel.getAll()
      res.json(blogs)
    } catch (err) {
      console.error('Error when obtaining Blogs:', err)
      res.status(500).json({
        message: 'Internal server error',
      })
    }
  }

  static async getById(req, res) {
    const { id } = req.params

    try {
      const blog = await BlogModel.getById({ id })

      if (!blog)
        return res.status(404).json({
          message: 'Property not found',
        })

      res.send(blog)
    } catch (err) {
      console.error('Error when obtaining Blog:', err)
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

      const newBlog = await BlogModel.create({ input, imagePath })

      res.status(201).json(newBlog)
    } catch (err) {
      console.error('Error creating Blog:', err)
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

      const { result, rows } = await BlogModel.update({
        id,
        input,
        imagePath,
      })

      if (result.affectedRows === 0)
        return res.status(404).json({
          message: 'Blog not found',
        })

      res.json(rows[0])
    } catch (err) {
      console.error('Error updating Blog:', err)
      res.status(500).json({
        message: 'Internal server error',
      })
    }
  }

  static async delete(req, res) {
    const { id } = req.params

    try {
      const { result } = await BlogModel.delete({ id })

      if (result.affectedRows <= 0)
        return res.status(404).json({
          message: 'Blog not found',
        })

      res.sendStatus(204)
    } catch (err) {
      console.error('Error when deleting a Blog:', err)
      res.status(500).json({
        message: 'Internal server error',
      })
    }
  }
}
