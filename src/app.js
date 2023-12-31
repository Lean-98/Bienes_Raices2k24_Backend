import express from 'express'
import session from 'express-session'
import testingRoutes from './routes/testing.js'
import blogsRoutes from './routes/blogs.js'
import adminRoutes from './routes/auth.js'
import propertiesRoutes from './routes/properties.js'
import testimonialsRoutes from './routes/testimonials.js'
import VendorsRoutes from './routes/vendors.js'
import { corsMiddlewares } from './middlewares/cors.js'
import { SECRECT_KEY_SESSION } from './config.js'
import { join } from 'path'
import { CURRENT_DIR } from '../src/middlewares/multerConfig.js'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true })) // Configurar para manejar datos de formulario
app.use(corsMiddlewares())
app.disable('x-powered-by')
app.use(
  session({
    secret: SECRECT_KEY_SESSION,
    resave: false,
    saveUninitialized: true,
  }),
)

app.use('/public', express.static(join(CURRENT_DIR, '../../uploads')))
app.use('/api/testing', testingRoutes)
app.use('/api/blogs', blogsRoutes)
app.use('/api', adminRoutes)
app.use('/api/properties', propertiesRoutes)
app.use('/api/testimonials', testimonialsRoutes)
app.use('/api/vendors', VendorsRoutes)

app.use((req, res, next) => {
  res.status(404).json({
    message: 'endpoint not found',
  })
})

export default app
