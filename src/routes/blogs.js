import { Router } from 'express'
import { BlogController } from '../controllers/blogs.js'
import upload from '../multerconfig.js'
import {
  validateUuidAndBlogExistence,
  validateUUID,
} from '../middlewares/index.js'

const blogsRouter = Router()

blogsRouter.get('/', BlogController.getAll)
blogsRouter.get('/:id', validateUuidAndBlogExistence, BlogController.getById)
blogsRouter.post('/', upload.single('image'), BlogController.create)
blogsRouter.patch(
  '/:id',
  validateUuidAndBlogExistence,
  upload.single('image'),
  BlogController.update,
)
blogsRouter.delete('/:id', validateUUID, BlogController.delete)

export default blogsRouter
