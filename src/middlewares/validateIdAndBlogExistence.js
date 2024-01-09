import { validate } from 'uuid'
import { BlogModel } from '../models/blog.js'

export const validateIdAndBlogExistence = async (req, res, next) => {
  const { id } = req.params

  if (!validate(id)) {
    return res.status(400).json({
      message: 'Invalid UUID format',
    })
  }

  const existingBlog = await BlogModel.find({ id })

  if (!existingBlog) {
    return res.status(404).json({
      message: 'Blog not found',
    })
  }

  next()
}
