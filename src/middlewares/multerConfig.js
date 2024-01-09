import multer from 'multer'
import { dirname, extname, join } from 'path'
import { fileURLToPath } from 'url'

export const CURRENT_DIR = dirname(fileURLToPath(import.meta.url))
export const MIMETYPES = [
  'image/jpg',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
]

const multerUpload = multer({
  storage: multer.diskStorage({
    destination: join(CURRENT_DIR, '../../uploads'),
    filename: (req, file, cb) => {
      const fileExtension = extname(file.originalname)
      const fileName = file.originalname.split(fileExtension)[0]
      cb(null, `${fileName}-${Date.now()}${fileExtension}`)
    },
  }),
  fileFilter: (req, file, cb) => {
    if (MIMETYPES.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error(`Only ${MIMETYPES.join(' ')} mimetypes are allowed`))
    }
  },
  limits: {
    fileSize: 10000000, // 10 MB
  },
})

const upload = multer(multerUpload)

export default upload
