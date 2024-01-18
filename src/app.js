import express from 'express'
import testingRoutes from './routes/testing.js'
import blogsRoutes from './routes/blogs.js'
import adminRoutes from './routes/auth.js'
import propertiesRoutes from './routes/properties.js'
import testimonialsRoutes from './routes/testimonials.js'
import VendorsRoutes from './routes/vendors.js'
import { corsMiddlewares } from './middlewares/cors.js'
import { join } from 'path'
import { CURRENT_DIR } from '../src/middlewares/multerConfig.js'
import { verifyToken } from '../src/middlewares/index.js'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true })) // Configurar para manejar datos de formulario
app.use(corsMiddlewares())
app.disable('x-powered-by')

app.use('/public', express.static(join(CURRENT_DIR, '../../uploads')))
app.use('/api/testing', verifyToken, testingRoutes)
app.use('/api/blogs', verifyToken, blogsRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/properties', verifyToken, propertiesRoutes)
app.use('/api/testimonials', verifyToken, testimonialsRoutes)
app.use('/api/vendors', verifyToken, VendorsRoutes)

// MIddleware para manejar rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({
    message: 'endpoint not found',
  })
})

export default app
