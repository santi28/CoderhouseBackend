import { Router } from 'express'
// import uploader from '../utils/multer.helper'
// import expressAsyncHandler from 'express-async-handler'

import * as productsController from '../controllers/products.controller'
import uploader from '../utils/multer.helper'
const router = Router()

router.get('/', productsController.getProducts)

router.post('/', uploader.single('picture'), productsController.createProduct)

router.get('/:slug', productsController.getProductBySlug)

// router.get(
//   '/',
//   expressAsyncHandler(productsController.getProducts)
// )

// router.get(
//   '/:id',
//   expressAsyncHandler(productsController.getProductById)
// )

// router.post(
//   '/', uploader.single('image'),
//   expressAsyncHandler(productsController.createProduct)
// )

// router.put(
//   '/:id',
//   expressAsyncHandler(productsController.updateProduct)
// )

export default router
