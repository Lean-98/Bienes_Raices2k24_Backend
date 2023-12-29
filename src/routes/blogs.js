import { Router } from 'express'
import { BlogController } from '../controllers/blogs.js'

const blogsRouter = Router()

blogsRouter.get('/', BlogController.getAll)
blogsRouter.get('/:id', BlogController.getById)
blogsRouter.post('/', BlogController.create)
blogsRouter.patch('/:id', BlogController.update)
blogsRouter.delete('/:id', BlogController.delete)

export default blogsRouter
