import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../api/axios.js'
import Loader from '../components/Loader.jsx'

const statusConfig = {
  processing: {
    label: 'Processing',
    bg: '#fef3c7',
    color: '#d97706',
  },
  shipped: {
    label: 'Shipped',
    bg: '#dbeafe',
    color: '#2563eb',
  },
  delivered: {
    label: 'Delivered',
    bg: '#dcfce7',
    color: '#16a34a',
  },
  cancelled: {
    label: 'Cancelled',
    bg: '#fee2e2',
    color: '#dc2626',
  },
}

const MyOrders = () => {
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/my-orders')

        setOrders(data)
      } catch (err) {
        toast.error('Orders not loaded')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading) return <Loader />

  if (orders.length === 0) {
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
          Not order now yet.!
        </p>
        <p style={{
          fontSize: '14px',
          color: '#a0aec0',
          marginBottom: '32px',
        }}>
         Do your First order.!
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
      maxWidth: '900px',
      margin: '0 auto',
      padding: '40px 24px',
    }}>
      <h1 style={{
        fontSize: '26px',
        fontWeight: '700',
        marginBottom: '32px',
      }}>
        My Orders ({orders.length})
      </h1>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}>
        {orders.map((order) => {
          const status = statusConfig[order.orderStatus]

          return (
            <div
              key={order._id}
              style={{
                padding: '24px',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                background: '#ffffff',
              }}
            >
              {/* Order Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '16px',
                flexWrap: 'wrap',
                gap: '12px',
              }}>
                <div>
                  <p style={{
                    fontSize: '12px',
                    color: '#718096',
                    marginBottom: '4px',
                  }}>
                    Order ID
                  </p>
                  <p style={{
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}>
                    #{order._id.slice(-8).toUpperCase()}
                  </p>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <p style={{
                    fontSize: '12px',
                    color: '#718096',
                    marginBottom: '4px',
                  }}>
                    Date
                  </p>
                  <p style={{ fontSize: '14px' }}>
                    {new Date(order.createdAt)
                      .toLocaleDateString('en', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                  </p>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <p style={{
                    fontSize: '12px',
                    color: '#718096',
                    marginBottom: '4px',
                  }}>
                    Total
                  </p>
                  <p style={{
                    fontSize: '16px',
                    fontWeight: '700',
                  }}>
                    ₹{order.totalPrice}
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <p style={{
                    fontSize: '12px',
                    color: '#718096',
                    marginBottom: '6px',
                  }}>
                    Status
                  </p>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '600',
                    background: status?.bg,
                    color: status?.color,
                  }}>
                    {status?.label}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div style={{
                borderTop: '1px solid #f7fafc',
                paddingTop: '16px',
                marginBottom: '16px',
              }}>
                <p style={{
                  fontSize: '13px',
                  color: '#718096',
                  marginBottom: '10px',
                }}>
                  Items ({order.orderItems.length})
                </p>
                <div style={{
                  display: 'flex',
                  gap: '10px',
                  flexWrap: 'wrap',
                }}>
                  {order.orderItems
                    .slice(0, 4)
                    .map((item, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <img
                          src={
                            item.image ||
                            'https://via.placeholder.com/50'
                          }
                          alt={item.name}
                          style={{
                            width: '50px',
                            height: '50px',
                            objectFit: 'cover',
                            borderRadius: '6px',
                          }}
                        />
                        <div>
                          <p style={{
                            fontSize: '12px',
                            fontWeight: '500',
                            maxWidth: '120px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}>
                            {item.name}
                          </p>
                          <p style={{
                            fontSize: '11px',
                            color: '#718096',
                          }}>
                            ×{item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  {order.orderItems.length > 4 && (
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '6px',
                      background: '#f7fafc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      color: '#718096',
                    }}>
                      +{order.orderItems.length - 4}
                    </div>
                  )}
                </div>
              </div>

              {/* Payment + Shipping Info */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '8px',
              }}>
                <div style={{
                  display: 'flex',
                  gap: '16px',
                  fontSize: '13px',
                  color: '#718096',
                }}>
                  <span>
                    Payment:{' '}
                    <strong style={{
                      color: order.paymentStatus === 'paid'
                        ? '#16a34a' : '#d97706',
                    }}>
                      {order.paymentStatus === 'paid'
                        ? 'Paid' : 'Pending'}
                    </strong>
                  </span>
                  <span>
                    {order.shippingAddress?.city},{' '}
                    {order.shippingAddress?.state}
                  </span>
                </div>
              </div>

            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MyOrders