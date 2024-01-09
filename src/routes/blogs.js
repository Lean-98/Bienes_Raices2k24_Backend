import { Router } from 'express'
import { BlogController } from '../controllers/blogs.js'
import {
  errorHandler,
  uploadAndValidateCombinedBlog,
  uploadAndValidateCombinedBlogUpdate,
  validateIdAndBlogExistence,
} from '../middlewares/index.js'

const blogsRouter = Router()

blogsRouter.get('/', BlogController.getAll)
blogsRouter.get('/:id', validateIdAndBlogExistence, BlogController.getById)
blogsRouter.post(
  '/',
  uploadAndValidateCombinedBlog.single('image'),
  errorHandler,
  BlogController.create,
)
blogsRouter.patch(
  '/:id',
  uploadAndValidateCombinedBlogUpdate.single('image'),
  errorHandler,
  BlogController.update,
)
blogsRouter.delete('/:id', validateIdAndBlogExistence, BlogController.delete)

export default blogsRouter
