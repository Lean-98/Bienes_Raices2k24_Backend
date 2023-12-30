import express from 'express'
import indexRoutes from './routes/index.js'
import blogsRoutes from './routes/blogs.js'
import adminRoutes from './routes/auth.js'
import propiedadesRoutes from './routes/propiedades.js'
import testimonialsRoutes from './routes/testimoniales.js'
import VendorsRoutes from './routes/vendors.js'
import { corsMiddlewares } from './middlewares/cors.js'

const app = express()
app.use(express.json())
app.use(corsMiddlewares())
app.disable('x-powered-by')

app.use('/api/testing', indexRoutes)
app.use('/api/blogs', blogsRoutes)
app.use('/api', adminRoutes) // TODO
app.use('/api/properties', propiedadesRoutes)
app.use('/api/testimonials', testimonialsRoutes)
app.use('/api/vendors', VendorsRoutes)

app.use((req, res, next) => {
  res.status(404).json({
    message: 'endpoint not found',
  })
})

export default app
