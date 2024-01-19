import cors from 'cors'

// métodos normales: GET/HEAD/POST
// métodos complejos: PUT/PATCH/DELETE
// CORS PRE-Flight

const ACCEPTED_ORIGINS = ['http://localhost:8080', 'http://localhost:3000']

export const corsMiddlewares = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) =>
  cors({
    origin: (origin, callback) => {
      if (acceptedOrigins.includes(origin)) {
        return callback(null, true)
      }

      if (!origin) {
        return callback(null, true)
      }

      return callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
  })
