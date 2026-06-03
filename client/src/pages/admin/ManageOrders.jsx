import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import api from '../../api/axios.js'
import Loader from '../../components/Loader.jsx'

const ManageOrders = () => {
  const [orders, setOrders]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('all')

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/orders')
      setOrders(data.orders)
    } catch {
      toast.error('Orders not loaded ')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, {
        orderStatus: newStatus,
      })
      toast.success('Status updated!')
      fetchOrders()
    } catch {
      toast.error('Status not updated ')
    }
  }

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter((o) => o.orderStatus === filter)

  const statusOptions = [
    'all', 'processing', 'shipped',
    'delivered', 'cancelled'
  ]

  const statusColors = {
    processing: { bg: '#fef3c7', color: '#d97706' },
    shipped:    { bg: '#dbeafe', color: '#2563eb' },
    delivered:  { bg: '#dcfce7', color: '#16a34a' },
    cancelled:  { bg: '#fee2e2', color: '#dc2626' },
  }

  if (loading) return <Loader />

  return (
    <div style={{
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '40px 24px',
    }}>

      <h1 style={{
        fontSize: '26px',
        fontWeight: '700',
        marginBottom: '8px',
      }}>
        Manage Orders
      </h1>

      <p style={{
        color: '#718096',
        marginBottom: '24px',
        fontSize: '14px',
      }}>
        Total: {orders.length} orders
      </p>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '28px',
        flexWrap: 'wrap',
      }}>
        {statusOptions.map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
              background: filter === status
                ? '#111111' : '#f7fafc',
              color: filter === status
                ? '#ffffff' : '#4a5568',
              textTransform: 'capitalize',
            }}
          >
            {status === 'all'
              ? `All (${orders.length})`
              : `${status} (${
                  orders.filter(
                    (o) => o.orderStatus === status
                  ).length
                })`}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '14px',
        }}>
          <thead>
            <tr style={{ background: '#f7fafc' }}>
              {['Order ID', 'Customer', 'Items',
                'Total', 'Payment', 'Status',
                'Update Status'].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#4a5568',
                    borderBottom: '2px solid #e2e8f0',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr
                key={order._id}
                style={{
                  borderBottom: '1px solid #f7fafc',
                }}
              >
                <td style={{
                  padding: '14px 16px',
                  fontFamily: 'monospace',
                  fontSize: '13px',
                }}>
                  #{order._id.slice(-8).toUpperCase()}
                </td>

                <td style={{ padding: '14px 16px' }}>
                  <p style={{ fontWeight: '500' }}>
                    {order.user?.name}
                  </p>
                  <p style={{
                    fontSize: '12px',
                    color: '#718096',
                  }}>
                    {order.user?.email}
                  </p>
                </td>

                <td style={{
                  padding: '14px 16px',
                  color: '#718096',
                }}>
                  {order.orderItems.length} items
                </td>

                <td style={{
                  padding: '14px 16px',
                  fontWeight: '700',
                }}>
                  ₹{order.totalPrice}
                </td>

                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background:
                      order.paymentStatus === 'paid'
                        ? '#dcfce7' : '#fef3c7',
                    color:
                      order.paymentStatus === 'paid'
                        ? '#16a34a' : '#d97706',
                  }}>
                    {order.paymentStatus}
                  </span>
                </td>

                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background:
                      statusColors[order.orderStatus]?.bg,
                    color:
                      statusColors[order.orderStatus]?.color,
                  }}>
                    {order.orderStatus}
                  </span>
                </td>

                <td style={{ padding: '14px 16px' }}>
                  <select
                    value={order.orderStatus}
                    onChange={(e) =>
                      handleStatusUpdate(
                        order._id,
                        e.target.value
                      )
                    }
                    style={{
                      padding: '6px 10px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '13px',
                      outline: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="processing">
                      Processing
                    </option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <p style={{
            textAlign: 'center',
            padding: '40px',
            color: '#718096',
          }}>
            No orders found.
          </p>
        )}
      </div>

    </div>
  )
}

export default ManageOrders