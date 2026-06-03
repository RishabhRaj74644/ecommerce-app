import { body, validationResult } from 'express-validator'

// Validation errors check karo
export const validate = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors.array()[0].msg,
      errors:  errors.array(),
    })
  }
  next()
}

// Register validation rules
export const validateRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be 2-50 characters'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/\d/)
    .withMessage('Password must contain a number'),

  validate,
]

// Login validation rules
export const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),

  validate,
]

// Product validation rules
export const validateProduct = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Name must be 2-200 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),

  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isNumeric()
    .withMessage('Price must be a number')
    .custom((value) => {
      if (value < 0) throw new Error('Price cannot be negative')
      return true
    }),

  body('stock')
    .notEmpty()
    .withMessage('Stock is required')
    .isInt({ min: 0 })
    .withMessage('Stock must be a positive number'),

  body('category')
    .notEmpty()
    .withMessage('Category is required'),

  validate,
]

// Review validation
export const validateReview = [
  body('rating')
    .notEmpty()
    .withMessage('Rating is required')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),

  body('comment')
    .trim()
    .notEmpty()
    .withMessage('Comment is required')
    .isLength({ min: 10 })
    .withMessage('Comment must be at least 10 characters'),

  validate,
]

// Order validation
export const validateOrder = [
  body('shippingAddress.address')
    .trim()
    .notEmpty()
    .withMessage('Address is required'),

  body('shippingAddress.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),

  body('shippingAddress.pincode')
    .trim()
    .notEmpty()
    .withMessage('Pincode is required')
    .isLength({ min: 6, max: 6 })
    .withMessage('Pincode must be 6 digits'),

  body('shippingAddress.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),

  body('paymentMethod')
    .notEmpty()
    .withMessage('Payment method is required')
    .isIn(['COD', 'Razorpay'])
    .withMessage('Invalid payment method'),

  validate,
]