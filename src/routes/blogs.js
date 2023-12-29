import { Router } from "express"
import { actualizarBlog, crearBlog, deleteBlog, getBlogId, getBlogs, } from "../controllers/blogs.controller.js";

const blogsRouter = Router()

blogsRouter.get('/', getBlogs)
blogsRouter.get('/:id', getBlogId)
blogsRouter.post('/', crearBlog)
blogsRouter.patch('/:id', actualizarBlog)
blogsRouter.delete('/:id', deleteBlog)

export default blogsRouter