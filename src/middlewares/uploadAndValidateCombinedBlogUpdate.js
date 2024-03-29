import { validate as validateUUID } from 'uuid'
import multer from 'multer'
import { extname, join } from 'path'
import { CURRENT_DIR, MIMETYPES } from './multerConfig.js'
import { ValidationError } from './ValidationError.js'
import { blogsSchema } from '../schemas/blogs.js'
import { BlogModel } from '../models/blog.js'

/*
  El middleware `uploadAndValidateCombinedBlogUpdate` gestiona la carga de archivos,
  realiza validaciones detalladas sobre la solicitud y utiliza la biblioteca `Zod`
  para definir y validar el esquema de los datos. Incluye verificación del formato
  de UUID, consulta a la base de datos, validación del tipo MIME y reglas específicas
  para cada campo. En caso de errores, utiliza un error personalizado (`ValidationError`)
  para proporcionar mensajes detallados sobre la validación. Además, establece límites,
  como el tamaño máximo del archivo permitido.
*/

export const uploadAndValidateCombinedBlogUpdate = multer({
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
      const { id } = req.params

      // Validar el formato del UUID antes de la consulta a la base de datos
      if (!validateUUID(id)) {
        throw new ValidationError([{ message: 'Invalid blog UUID format' }])
      }

      const blog = await BlogModel.find({ id })

      if (!blog) {
        throw new ValidationError([
          {
            message: 'Invalid UUID: Blog ID does not exist in the database',
          },
        ])
      }

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
        image: req.files ? req.files.map(file => file.filename) : [],
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
