import express from 'express'
import {
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  updateUserRole,
  deleteUser,
} from '../controllers/userController.js'
import { protect, adminOnly } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect)

router.get('/profile', getProfile)
router.put('/profile', updateProfile)
router.put('/change-password', changePassword)

router.get('/', adminOnly, getAllUsers)
router.put('/:id/role', adminOnly, updateUserRole)
router.delete('/:id', adminOnly, deleteUser)

export default router