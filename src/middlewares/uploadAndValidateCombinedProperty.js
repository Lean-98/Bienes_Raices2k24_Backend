import { validate as validateUUID } from 'uuid'
import multer from 'multer'
import { extname, join } from 'path'
import { pool } from '../db.js'
import { CURRENT_DIR, MIMETYPES } from './multerConfig.js'
import { propertySchema } from '../schemas/properties.js'
import { ValidationError } from './ValidationError.js'

/*
 El middleware `uploadAndValidateCombinedProperty` gestiona la carga de archivos,
 utiliza la biblioteca Multer para manejar la subida de archivos y configura la ubicación
 de almacenamiento y nombres de archivo únicos con marcas de tiempo.

 La biblioteca Zod se utiliza para definir y validar el esquema de los datos, asegurando
 que los inputs cumplan con ciertas reglas y estructuras.

 El middleware realiza una validación exhaustiva, incluyendo la verificación del formato
 de UUID para `vendor_id`, consulta a la base de datos para confirmar su existencia,
 validación del tipo MIME del archivo y restricciones específicas para cada campo de la solicitud.

 En caso de errores, se lanza un error personalizado (`ValidationError`) que proporciona
 mensajes detallados sobre la validación fallida, brindando información útil para la
 depuración y corrección.

 Se establece un límite máximo de tamaño de archivo permitido (10 MB) para evitar la carga
 de archivos excesivamente grandes que podrían afectar el rendimiento del sistema o la seguridad.

 En situaciones exitosas, el middleware construye un objeto con los datos de la solicitud y
 la información del archivo, asignándolo a `req.validatedInput`. Esto asegura que solo se
 procesen archivos que cumplan con los criterios definidos, proporcionando una capa adicional
 de seguridad y validación previa antes de manipular los datos en la aplicación.
*/

export const uploadAndValidateCombinedProperty = multer({
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

      // Validar el número máximo de archivos permitidos (6 en este caso)
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
