import { Router } from 'express'
import { BlogController } from '../controllers/blogs.js'
import upload from '../multerconfig.js'
import {
  validateUuidAndEntityExistence,
  validateUUID,
} from '../middlewares/index.js'

const blogsRouter = Router()

blogsRouter.get('/', BlogController.getAll)
blogsRouter.get('/:id', validateUuidAndEntityExistence, BlogController.getById)
blogsRouter.post('/', upload.single('image'), BlogController.create)
blogsRouter.patch(
  '/:id',
  validateUuidAndEntityExistence,
  upload.single('image'),
  BlogController.update,
)
blogsRouter.delete('/:id', validateUUID, BlogController.delete)

export default blogsRouter
