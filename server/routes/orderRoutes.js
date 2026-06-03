import express from 'express'
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderStatus,
  getAllOrders,
  createRazorpayOrder,
  verifyPayment,
} from '../controllers/orderController.js'
import { protect, adminOnly } from '../middleware/authMiddleware.js'
import { validateOrder } from '../middleware/validationMiddleware.js'

const router = express.Router()

router.use(protect)

router.post('/',validateOrder, createOrder)
router.get('/my-orders', getMyOrders)
router.get('/:id', getOrderById)
router.put('/:id/pay', updateOrderToPaid)

router.get('/', adminOnly, getAllOrders)
router.put('/:id/status', adminOnly, updateOrderStatus)

router.post('/:id/razorpay',        createRazorpayOrder)
router.post('/:id/verify-payment',  verifyPayment)

export default router