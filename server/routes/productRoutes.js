import express from 'express'
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createReview,
} from '../controllers/productController.js'
import { protect, adminOnly } from '../middleware/authMiddleware.js'
import upload from '../middleware/uploadMiddleware.js'   
import { validateProduct, validateReview } from '../middleware/validationMiddleware.js'

const router = express.Router()

router.get('/', getProducts)
router.get('/:id', getProductById)

router.post(
  '/',
  protect,
  adminOnly,
  upload.array('images', 5),   
  validateProduct,
  createProduct
)
router.put(
  '/:id',
  protect,
  adminOnly,
  upload.array('images', 5),  
  updateProduct
)
router.delete('/:id', protect, adminOnly, deleteProduct)

router.post('/:id/reviews', protect, validateReview, createReview)

export default router