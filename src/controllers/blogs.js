import { BlogModel } from '../models/blogs.js'
import { validatorUUID } from '../utils/validatoruuid.js'

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
    if (!validatorUUID(id)) {
      return res.status(400).json({
        message: 'Invalid ID format',
      })
    }
    const blog = await BlogModel.getById({ id })

    if (!blog)
      return res.status(404).json({
        message: 'Blog not found',
      })
    res.send(blog)
  }

  static async create(req, res) {
    const input = req.body
    try {
      const newBlog = await BlogModel.create({ input })
      res.status(201).json(newBlog)
    } catch (error) {
      return res.status(500).json({
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

    const { result, rows } = await BlogModel.update({ id, input })

    if (result.affectedRows === 0)
      return res.status(404).json({
        message: 'Blog not found',
      })

    res.json(rows[0])
  }

  static async delete(req, res) {
    const { id } = req.params
    if (!validatorUUID(id)) {
      return res.status(400).json({
        message: 'Invalid ID format',
      })
    }

    const { result } = await BlogModel.delete({ id })
    if (result.affectedRows <= 0)
      return res.status(404).json({
        message: 'Blog not found',
      })
    res.sendStatus(204)
  }
}
