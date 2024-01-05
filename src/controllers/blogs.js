import { BlogModel } from '../models/blog.js'
import { validateblog } from '../schemas/blogs.js'
import { DB_HOST, PORT } from '../config.js'
import path from 'node:path'

export class BlogController {
  static async getAll(req, res) {
    try {
      const blogs = await BlogModel.getAll()
      res.json(blogs)
    } catch (error) {
      res.status(500).json({
        message: 'Something goes wrong',
      })
    }
  }

  static async getById(req, res) {
    const { id } = req.params

    const blog = await BlogModel.getById({ id })

    res.send(blog)
  }

  static async create(req, res) {
    const input = validateblog(req.body)
    // Obténer solo el nombre del archivo de la ruta
    const fileName = path.basename(req.file.path)
    // Agrega la ruta de la imagen al host del SV
    const imagePath = `http://${DB_HOST}:${PORT}/public/${fileName}`
    // console.log(imagePath)

    try {
      const newBlog = await BlogModel.create({ input, imagePath })
      res.status(201).json(newBlog)
    } catch (error) {
      return res.status(500).json({
        message: 'Something goes wrong',
      })
    }
  }

  static async update(req, res) {
    const { id } = req.params
    const input = validateblog(req.body)

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
  }

  static async delete(req, res) {
    const { id } = req.params

    const { result } = await BlogModel.delete({ id })

    if (result.affectedRows <= 0)
      return res.status(404).json({
        message: 'Blog not found',
      })
    res.sendStatus(204)
  }
}
