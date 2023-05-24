import multer from 'multer'
import path from 'path'
import { v4 as uuid } from 'uuid'

// Definimos el storage para multer
export const storage = multer.diskStorage({
  // Definimos el destino de los archivos
  destination: (req, file, cb) => {
    return cb(null, path.join(__dirname, '../..', 'public', 'uploads'))
  },
  // Definimos el nombre del archivo
  filename: (req, file, cb) => {
    const uniqueName = uuid() + path.extname(file.originalname)
    return cb(null, uniqueName)
  }
})

// Exportamos el uploader con la configuración de multer
export const uploader = multer({ storage })
export default uploader
