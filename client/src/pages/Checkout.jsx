import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clearCart } from '../store/cartSlice.js'
import { toast } from 'react-toastify'
import api from '../api/axios.js'

const Checkout = () => {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()

  const { items, totalAmount } = useSelector(
    (state) => state.cart
  )

  const shippingPrice = totalAmount >= 500 ? 0 : 50
  const finalTotal    = totalAmount + shippingPrice

  const [loading, setLoading] = useState(false)

  const [address, setAddress] = useState({
    address: '',
    city: '',
    pincode: '',
    state: '',
  })

  const [paymentMethod, setPaymentMethod] = useState('COD')

  const handleSubmit = async (e) => {
  e.preventDefault()

  if (items.length === 0) {
    toast.error('Cart is Empty')
    return navigate('/cart')
  }

  if (!address.address || !address.city ||
      !address.pincode || !address.state) {
    toast.error('Fill full Address')
    return
  }

  setLoading(true)

  try {
    const { data } = await api.post('/orders', {
      shippingAddress: address,
      paymentMethod,
    })

    const orderId = data.order._id

    
    if (paymentMethod === 'COD') {
      await dispatch(clearCart())
      toast.success('Order placed.!')
      return navigate('/my-orders')
    }

    
    const { data: rzpData } = await api.post(
      `/orders/${orderId}/razorpay`
    )

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount:   rzpData.amount,
      currency: rzpData.currency,
      name:     'ShopApp',
      description: 'Order Payment',
      order_id: rzpData.razorpayOrderId,

      // Payment success handler
      handler: async (response) => {
        try {
          //Payment verify
          await api.post(`/orders/${orderId}/verify-payment`, {
            razorpay_order_id:   response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature:  response.razorpay_signature,
          })

          await dispatch(clearCart())
          toast.success('Payment successful!')
          navigate('/my-orders')
        } catch {
          toast.error('Payment not verified')
        }
      },

      prefill: {
        name:  'Customer',
        email: 'customer@example.com',
      },

      theme: {
        color: '#111111',
      },

      // Payment failed/closed
      modal: {
        ondismiss: () => {
          toast.info('Payment cancelled')
          setLoading(false)
        },
      },
    }

    // Step 5 — Razorpay popup open
    const rzp = new window.Razorpay(options)
    rzp.open()

    } catch (err) {
    toast.error(
      err.response?.data?.message || 'Order not happend.!'
    )
  } finally {
    setLoading(false)
  }
}


  return (
    <div style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: '40px 24px',
    }}>
      <h1 style={{
        fontSize: '26px',
        fontWeight: '700',
        marginBottom: '32px',
      }}>
        Checkout
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 320px',
        gap: '32px',
      }}>

        {/* Form */}
        <form onSubmit={handleSubmit}>

          {/* Shipping Address */}
          <div style={{
            padding: '28px',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            marginBottom: '24px',
          }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '20px',
            }}>
              Shipping Address
            </h2>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}>
              <input
                placeholder="Ghar/Mohalla/Street"
                value={address.address}
                onChange={(e) =>
                  setAddress({
                    ...address,
                    address: e.target.value,
                  })
                }
                required
                style={inputStyle}
              />
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '14px',
              }}>
                <input
                  placeholder="city"
                  value={address.city}
                  onChange={(e) =>
                    setAddress({
                      ...address,
                      city: e.target.value,
                    })
                  }
                  required
                  style={inputStyle}
                />
                <input
                  placeholder="Pincode"
                  value={address.pincode}
                  onChange={(e) =>
                    setAddress({
                      ...address,
                      pincode: e.target.value,
                    })
                  }
                  required
                  style={inputStyle}
                />
              </div>
              <input
                placeholder="State"
                value={address.state}
                onChange={(e) =>
                  setAddress({
                    ...address,
                    state: e.target.value,
                  })
                }
                required
                style={inputStyle}
              />
            </div>
          </div>

          {/* Payment Method */}
          <div style={{
            padding: '28px',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            marginBottom: '24px',
          }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '20px',
            }}>
              Payment Method
            </h2>

            {['COD', 'Razorpay'].map((method) => (
              <label
                key={method}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '14px',
                  cursor: 'pointer',
                  fontSize: '15px',
                }}
              >
                <input
                  type="radio"
                  name="payment"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={() => setPaymentMethod(method)}
                  style={{ width: '16px', height: '16px' }}
                />
                {method === 'COD'
                  ? 'Cash on Delivery'
                  : 'Online Payment (Razorpay)'}
              </label>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: '#111111',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Your Order is happenning...' : ' Place the order'}
          </button>

        </form>

        {/* Order Summary */}
        <div style={{
          padding: '24px',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          alignSelf: 'flex-start',
          position: 'sticky',
          top: '80px',
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '700',
            marginBottom: '16px',
          }}>
            Order Summary
          </h2>

          {items.map((item) => (
            <div
              key={item._id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '10px',
                fontSize: '13px',
              }}
            >
              <span style={{ color: '#718096' }}>
                {item.name} × {item.quantity}
              </span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}

          <div style={{
            borderTop: '1px solid #e2e8f0',
            marginTop: '12px',
            paddingTop: '12px',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '8px',
              fontSize: '13px',
            }}>
              <span style={{ color: '#718096' }}>Shipping</span>
              <span style={{
                color: shippingPrice === 0 ? '#38a169' : '#111',
              }}>
                {shippingPrice === 0 ? 'Free' : `₹${shippingPrice}`}
              </span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: '700',
              fontSize: '17px',
            }}>
              <span>Total</span>
              <span>₹{finalTotal}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
}

export default Checkout