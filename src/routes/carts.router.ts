import { Router } from 'express'

// import uploader from '../utils/multer.helper'
import * as cartsController from '../controllers/carts.controller'
import { executePolicy } from '../middlewares/authenticate.middleware'

const router = Router()

router.get('/', executePolicy(['AUTHENTICATED']), cartsController.getCart)
router.post('/', executePolicy(['AUTHENTICATED']), cartsController.addProductToCart)
router.put('/:productId', executePolicy(['AUTHENTICATED']), cartsController.updateProductQuantity)
router.delete('/:productId', executePolicy(['AUTHENTICATED']), cartsController.deleteProductFromCart)
router.delete('/', executePolicy(['AUTHENTICATED']), cartsController.deleteCart)

export default router
