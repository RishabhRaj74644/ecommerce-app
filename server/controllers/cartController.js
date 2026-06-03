import Cart from '../models/Cart.js'
import Product from '../models/Product.js'

//getcart
export const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'name images price stock')

    if (!cart) {
      return res.json({ items: [], totalAmount: 0 })
    }

    res.json(cart)
  } catch (error) {
    next(error)
  }
}

//addToCart
export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body
    const product = await Product.findById(productId)

    if (!product) {
      return res.status(404).json({ message: 'Product Not Found' })
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        message: 'That much stock is not available',
      })
    }

    let cart = await Cart.findOne({ user: req.user._id })

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] })
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    )

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity
    } else {
      cart.items.push({
        product: productId,
        name: product.name,
        image: product.images[0] || '',
        price: product.price,
        quantity,
      })
    }

    await cart.save()
    res.json(cart)
  } catch (error) {
    next(error)
  }
}


//updateCartItem
export const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body

    const cart = await Cart.findOne({ user: req.user._id })

    if (!cart) {
      return res.status(404).json({ message: 'Cart Not Found' })
    }

    const item = cart.items.id(req.params.itemId)

    if (!item) {
      return res.status(404).json({ message: 'Item is not in cart ' })
    }

    item.quantity = quantity

    await cart.save()
    res.json(cart)
  } catch (error) {
    next(error)
  }
}

//removeFromCart
export const removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })

    if (!cart) {
      return res.status(404).json({ message: 'Cart Not Found' })
    }

    cart.items = cart.items.filter(
      (item) => item._id.toString() !== req.params.itemId
    )

    await cart.save()
    res.json(cart)
  } catch (error) {
    next(error)
  }
}

//clearCart
export const clearCart = async (req, res, next) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id })
    res.json({ message: 'Cart Cleared' })
  } catch (error) {
    next(error)
  }
}