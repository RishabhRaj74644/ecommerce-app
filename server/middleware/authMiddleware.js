import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const protect = async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return res.status(401).json({
      message: 'Not authorized — no token',
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // User exist karta hai? Check karo
    const user = await User.findById(decoded.id).select('-password')

    if (!user) {
      return res.status(401).json({
        message: 'User no longer exists',
      })
    }

    req.user = user
    next()
  } catch (error) {
    // Token type se alag message do
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token expired — please login again',
      })
    }
    return res.status(401).json({
      message: 'Not authorized — invalid token',
    })
  }
}

export const adminOnly = (req,res,next) => {
    if(req.user && req.user.role === 'admin') {
        next()
    } else {
        res.status(403).json({message: 'Only Admin can access'})
    }
}


// Sensitive operations ke liye
// User apna password confirm kare
export const requirePasswordConfirm = async (req, res, next) => {
  const { confirmPassword } = req.body

  if (!confirmPassword) {
    return res.status(400).json({
      message: 'Please confirm your password',
    })
  }

  const user = await User.findById(req.user._id)
    .select('+password')

  const isMatch = await user.matchPassword(confirmPassword)

  if (!isMatch) {
    return res.status(401).json({
      message: 'Incorrect password',
    })
  }

  next()
}