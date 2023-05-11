import { Router } from 'express'
import uploader from '../utils/multer.helper'
import expressAsyncHandler from 'express-async-handler'
import productsController from '../controllers/products.controller'
const router = Router()

router.get(
  '/',
  expressAsyncHandler(productsController.getProducts)
)

router.get(
  '/:id',
  expressAsyncHandler(productsController.getProductById)
)

router.post(
  '/', uploader.single('image'),
  expressAsyncHandler(productsController.createProduct)
)

router.put(
  '/:id',
  expressAsyncHandler(productsController.updateProduct)
)

export default router
