import express from 'express'
import {register,login,logout,refreshToken} from '../controllers/authController.js'
import {validateRegister,validateLogin,} from '../middleware/validationMiddleware.js'

const router = express.Router()

router.post('/register', validateRegister, register)
router.post('/login',validateLogin, login)
router.post('/logout', logout)
router.post('refresh-token', refreshToken)

export default router