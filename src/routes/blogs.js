import { Router } from 'express'
import { BlogController } from '../controllers/blogs.js'
import upload from '../multerconfig.js'

const blogsRouter = Router()

blogsRouter.get('/', BlogController.getAll)
blogsRouter.get('/:id', BlogController.getById)
blogsRouter.post('/', upload.single('image'), BlogController.create)
blogsRouter.patch('/:id', upload.single('image'), BlogController.update)
blogsRouter.delete('/:id', BlogController.delete)

export default blogsRouter
