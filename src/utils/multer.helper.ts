import multer from 'multer'
import path from 'path'
import { v4 as uuid } from 'uuid'

export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    return cb(null, path.join(__dirname, '..', 'public', 'uploads'))
  },
  filename: (req, file, cb) => {
    const uniqueName = uuid() + path.extname(file.originalname)
    return cb(null, uniqueName)
  }
})

export const uploader = multer({ storage })
export default uploader
