import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import {
  fetchCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../store/cartSlice.js'
import { toast } from 'react-toastify'
import Loader from '../components/Loader.jsx'
import useAuth from '../hooks/useAuth.js'

const Cart = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const { items, totalAmount, loading } = useSelector(
    (state) => state.cart
  )

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart())
    }
  }, [isAuthenticated])

  const handleQuantityChange = async (itemId, newQty) => {
    if (newQty < 1) {
      dispatch(removeFromCart(itemId))
      return
    }
    try {
      await dispatch(updateCartItem({
        itemId,
        quantity: newQty,
      })).unwrap()
    } catch (err) {
      toast.error(err || 'Not Updated')
    }
  }

  const handleRemove = async (itemId) => {
    try {
      await dispatch(removeFromCart(itemId)).unwrap()
      toast.success('Item removed')
    } catch {
      toast.error('Item not Removed')
    }
  }

  const handleClearCart = async () => {
    try {
      await dispatch(clearCart()).unwrap()
      toast.success('Cart cleared')
    } catch {
      toast.error('Cart not cleared')
    }
  }

  const shippingPrice = totalAmount >= 500 ? 0 : 50
  const finalTotal    = totalAmount + shippingPrice

  if (loading) return <Loader />

  if (!isAuthenticated || items.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '80px 24px',
      }}>
        <p style={{
          fontSize: '20px',
          color: '#718096',
          marginBottom: '8px',
        }}>
          Your cart is Empty
        </p>
        <p style={{
          fontSize: '14px',
          color: '#a0aec0',
          marginBottom: '32px',
        }}>
          Add some product.!
        </p>
        <Link
          to="/products"
          style={{
            padding: '12px 28px',
            background: '#111111',
            color: '#ffffff',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '15px',
            fontWeight: '600',
          }}
        >
          Shopping 
        </Link>
      </div>
    )
  }

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '40px 24px',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
      }}>
        <h1 style={{
          fontSize: '26px',
          fontWeight: '700',
        }}>
          Shopping Cart ({items.length} items)
        </h1>
        <button
          onClick={handleClearCart}
          style={{
            background: 'none',
            border: 'none',
            color: '#e53e3e',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Clear the Cart
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 340px',
        gap: '32px',
      }}>

        {/* Items List */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}>
          {items.map((item) => (
            <div
              key={item._id}
              style={{
                display: 'flex',
                gap: '16px',
                padding: '20px',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                alignItems: 'center',
              }}
            >
              <img
                src={
                  item.image ||
                  'https://via.placeholder.com/100'
                }
                alt={item.name}
                style={{
                  width: '90px',
                  height: '90px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              />

              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '4px',
                }}>
                  {item.name}
                </h3>
                <p style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#111111',
                  marginBottom: '12px',
                }}>
                  ₹{item.price}
                </p>

                {/* Quantity Controls */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}>
                  <button
                    onClick={() =>
                      handleQuantityChange(
                        item._id,
                        item.quantity - 1
                      )
                    }
                    style={qtyBtnStyle}
                  >
                    −
                  </button>
                  <span style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    minWidth: '20px',
                    textAlign: 'center',
                  }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      handleQuantityChange(
                        item._id,
                        item.quantity + 1
                      )
                    }
                    style={qtyBtnStyle}
                  >
                    +
                  </button>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <p style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  marginBottom: '8px',
                }}>
                  ₹{item.price * item.quantity}
                </p>
                <button
                  onClick={() => handleRemove(item._id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#e53e3e',
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div style={{
          padding: '28px',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          alignSelf: 'flex-start',
          position: 'sticky',
          top: '80px',
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '700',
            marginBottom: '20px',
          }}>
            Order Summary
          </h2>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '12px',
            fontSize: '14px',
          }}>
            <span style={{ color: '#718096' }}>Subtotal</span>
            <span>₹{totalAmount}</span>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '20px',
            fontSize: '14px',
          }}>
            <span style={{ color: '#718096' }}>Shipping</span>
            <span style={{
              color: shippingPrice === 0 ? '#38a169' : '#111111',
            }}>
              {shippingPrice === 0 ? 'Free!' : `₹${shippingPrice}`}
            </span>
          </div>

          {totalAmount < 500 && (
            <p style={{
              fontSize: '12px',
              color: '#718096',
              marginBottom: '16px',
              padding: '8px 12px',
              background: '#f7fafc',
              borderRadius: '6px',
            }}>
              ₹{500 - totalAmount} Buy more —
              you will get free shipping.!
            </p>
          )}

          <div style={{
            borderTop: '2px solid #e2e8f0',
            paddingTop: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '20px',
          }}>
            <span style={{
              fontWeight: '700',
              fontSize: '17px',
            }}>
              Total
            </span>
            <span style={{
              fontWeight: '700',
              fontSize: '19px',
            }}>
              ₹{finalTotal}
            </span>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            style={{
              width: '100%',
              padding: '14px',
              background: '#111111',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Checkout
          </button>
        </div>

      </div>
    </div>
  )
}

const qtyBtnStyle = {
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  border: '1px solid #e2e8f0',
  background: '#f7fafc',
  cursor: 'pointer',
  fontSize: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

export default Cart