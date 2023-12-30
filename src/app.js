import express from 'express'
import indexRoutes from './routes/index.js'
import blogsRoutes from './routes/blogs.js'
import adminRoutes from './routes/auth.js'
import propertiesRoutes from './routes/properties.js'
import testimonialsRoutes from './routes/testimonials.js'
import VendorsRoutes from './routes/vendors.js'
import { corsMiddlewares } from './middlewares/cors.js'

const app = express()
app.use(express.json())
app.use(corsMiddlewares())
app.disable('x-powered-by')

app.use('/api/testing', indexRoutes) //TODO: Validate run time types dates: input
app.use('/api/blogs', blogsRoutes) //TODO: Validate run time types dates: input
app.use('/api', adminRoutes) // TODO Validate run time types dates: input
app.use('/api/properties', propertiesRoutes) //TODO: Validate run time types dates: input
app.use('/api/testimonials', testimonialsRoutes) //TODO: Validate run time types dates: input
app.use('/api/vendors', VendorsRoutes) //TODO: Validate run time types dates: input

app.use((req, res, next) => {
  res.status(404).json({
    message: 'endpoint not found',
  })
})

export default app
