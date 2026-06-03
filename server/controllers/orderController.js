import Order from '../models/Order.js'
import Cart from '../models/Cart.js'
import Product from '../models/Product.js'
import razorpay from '../config/razorpay.js'
import crypto from 'crypto'

export const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod } = req.body

    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'price stock')

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is Empty' })
    }

    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          message: `${item.name} is less in stock `,
        })
      }
    }

    const itemsPrice = cart.totalAmount
    const shippingPrice = itemsPrice >= 500 ? 0 : 50
    const totalPrice = itemsPrice + shippingPrice

    const order = await Order.create({
      user: req.user._id,
      orderItems: cart.items.map((item) => ({
        product: item.product._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    })

    for (const item of cart.items) {
      await Product.findByIdAndUpdate(
        item.product._id,
        { $inc: { stock: -item.quantity } }
      )
    }

    await Cart.findOneAndDelete({ user: req.user._id })

    res.status(201).json({ success: true, order })
  } catch (error) {
    next(error)
  }
}

// POST /api/orders/:id/razorpay
export const createRazorpayOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({
        message: 'Order not Found',
      })
    }

    // Razorpay order banao
    const razorpayOrder = await razorpay.orders.create({
      amount:   order.totalPrice * 100, // Paise mein
      currency: 'INR',
      receipt:  order._id.toString(),
    })
    res.json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount:          razorpayOrder.amount,
      currency:        razorpayOrder.currency,
    })
  } catch (error) {
    next(error)
  }
}

// POST /api/orders/:id/verify-payment
export const verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body

    const body = razorpay_order_id + '|' + razorpay_payment_id

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex')

      if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        message: 'Payment verification failed',
      })
    }

    // Order paid mark karo
    const order = await Order.findById(req.params.id)

    order.paymentStatus = 'paid'
    order.paidAt        = Date.now()
    order.paymentResult = {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    }

    await order.save()

    res.json({
      success: true,
      message: 'Payment verified!',
      order,
    })
  } catch (error) {
    next(error)
  }
}

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort('-createdAt')
    res.json(orders)
  } catch (error) {
    next(error)
  }
}

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')

    if (!order) {
      return res.status(404).json({ message: 'Order not Found' })
    }

    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        message: 'This is not your Order',
      })
    }

    res.json(order)
  } catch (error) {
    next(error)
  }
}

export const updateOrderToPaid = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ message: 'Order not Found' })
    }

    order.paymentStatus = 'paid'
    order.paidAt = Date.now()
    order.paymentResult = req.body.paymentResult

    await order.save()
    res.json({ success: true, order })
  } catch (error) {
    next(error)
  }
}

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body

    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ message: 'Order not Found' })
    }

    order.orderStatus = orderStatus

    if (orderStatus === 'delivered') {
      order.deliveredAt = Date.now()
    }

    await order.save()
    res.json({ success: true, order })
  } catch (error) {
    next(error)
  }
}

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort('-createdAt')

    const totalRevenue = orders
      .filter((o) => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.totalPrice, 0)

    res.json({
      success: true,
      count: orders.length,
      totalRevenue,
      orders,
    })
  } catch (error) {
    next(error)
  }
}