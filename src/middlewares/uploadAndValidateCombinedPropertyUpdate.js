import { validate as validateUUID } from 'uuid'
import multer from 'multer'
import { extname, join } from 'path'
import { pool } from '../db.js'
import { CURRENT_DIR, MIMETYPES } from './multerConfig.js'
import { propertySchema } from '../schemas/properties.js'
import { ValidationError } from './ValidationError.js'
import { PropertyModel } from '../models/property.js'

/*
  El middleware `uploadAndValidateCombinedPropertyUpdate` gestiona la carga de archivos,
  realiza validaciones detalladas sobre la solicitud y utiliza la biblioteca `Zod`
  para definir y validar el esquema de los datos. Incluye verificación del formato
  de UUID, consulta a la base de datos, validación del tipo MIME y reglas específicas
  para cada campo. En caso de errores, utiliza un error personalizado (`ValidationError`)
  para proporcionar mensajes detallados sobre la validación. Además, establece límites,
  como el tamaño máximo del archivo permitido.
*/

export const uploadAndValidateCombinedPropertyUpdate = multer({
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
      const { vendor_id } = req.body
      const { id } = req.params

      const property = await PropertyModel.find({ id })

      if (!property) {
        throw new ValidationError([
          {
            message: 'Invalid UUID: Property ID does not exist in the database',
          },
        ])
      }

      // Validar el formato del UUID antes de la consulta a la base de datos
      if (!validateUUID(vendor_id)) {
        throw new ValidationError([{ message: 'Invalid vendor UUID format' }])
      }

      // Verificar el vendor_id en la base de datos después de la validación del UUID
      const [vendor] = await pool.query(
        'SELECT id FROM vendors WHERE id = UUID_TO_BIN(?)',
        [vendor_id],
      )

      if (vendor.length === 0) {
        throw new ValidationError([
          {
            message: 'Invalid UUID: vendor_id does not exist in the database',
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

      // Validar el tamaño del archivo
      if (file.size > 10000000) {
        throw new ValidationError([
          {
            message: 'File size exceeds the limit of 10 MB',
          },
        ])
      }

      if (req.files.length > 6) {
        throw new ValidationError([
          {
            message: 'Maximum number of images allowed is 6',
          },
        ])
      }

      const inputData = {
        ...req.body,
        images: Array.isArray(req.files)
          ? req.files.map(file => file.filename)
          : [],
      }

      // Validar el cuerpo de la solicitud con el schema de Zod
      req.validatedInput = propertySchema.parse(inputData)
      cb(null, true)
    } catch (error) {
      cb(error) // Pasar el error al errorHandler para su manejo
    }
  },
  limits: {
    fileSize: 10000000, // 10 MB
  },
})
