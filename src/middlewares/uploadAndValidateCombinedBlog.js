import multer from 'multer'
import { extname, join } from 'path'
import { CURRENT_DIR, MIMETYPES } from './multerConfig.js'
import { ValidationError } from './ValidationError.js'
import { blogsSchema } from '../schemas/blogs.js'

/*
  El middleware `uploadAndValidateCombinedBlog` gestiona la carga de archivos,
  realiza validaciones detalladas sobre la solicitud y utiliza la biblioteca `Zod`
  para definir y validar el esquema de los datos. Validación del tipo MIME y reglas específicas
  para cada campo. En caso de errores, utiliza un error personalizado (`ValidationError`)
  para proporcionar mensajes detallados sobre la validación. Además, establece límites,
  como el tamaño máximo del archivo permitido.
*/

export const uploadAndValidateCombinedBlog = multer({
  storage: multer.diskStorage({
    destination: join(CURRENT_DIR, '../../uploads'),
    filename: (req, file, cb) => {
      const fileExtension = extname(file.originalname)
      const fileName = file.originalname.split(fileExtension)[0]
      cb(null, `${fileName}-${Date.now()}${fileExtension}`)
    },
  }),
  fileFilter: async (req, file, cb) => {
    try {
      // Validar el tipo de archivo (MIME Type)
      if (!MIMETYPES.includes(file.mimetype)) {
        throw new ValidationError([
          {
            message: `Only ${MIMETYPES.join(' ')} mimetypes are allowed`,
          },
        ])
      }

      const inputData = {
        ...req.body,
        image: req.file?.filename || req.body.image,
      }

      // Validar el cuerpo de la solicitud con el schema de Zod
      req.validatedInput = blogsSchema.parse(inputData)
      cb(null, true)
    } catch (error) {
      cb(error) // Pasar el error al errorHandler para su manejo
    }
  },
  limits: {
    fileSize: 10000000, // 10 MB
  },
})
