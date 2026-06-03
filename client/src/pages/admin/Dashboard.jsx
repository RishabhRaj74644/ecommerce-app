import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios.js'
import Loader from '../../components/Loader.jsx'

const Dashboard = () => {
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, productsRes, usersRes] = await Promise.all([
          api.get('/orders'),
          api.get('/products?limit=100'),
          api.get('/users'),
        ])

        const orders   = ordersRes.data.orders
        const products = productsRes.data.products
        const users    = usersRes.data.users

        setStats({
          totalOrders:   orders.length,
          totalRevenue:  ordersRes.data.totalRevenue,
          totalProducts: products.length,
          totalUsers:    users.length,
          recentOrders:  orders.slice(0, 5),
          lowStock: products.filter(
            (p) => p.stock < 5
          ),
        })
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) return <Loader />
  if (!stats)  return null

  const statCards = [
    {
      label: 'Total Revenue',
      value: `₹${stats.totalRevenue?.toFixed(0) || 0}`,
      bg: '#dcfce7',
      color: '#16a34a',
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders,
      bg: '#dbeafe',
      color: '#2563eb',
    },
    {
      label: 'Total Products',
      value: stats.totalProducts,
      bg: '#fef3c7',
      color: '#d97706',
    },
    {
      label: 'Total Users',
      value: stats.totalUsers,
      bg: '#f3e8ff',
      color: '#9333ea',
    },
  ]

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
        Admin Dashboard
      </h1>

      <p style={{
        color: '#718096',
        marginBottom: '32px',
        fontSize: '14px',
      }}>
        Welcome back! Here's what's happening.
      </p>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
        marginBottom: '40px',
      }}>
        {statCards.map((card) => (
          <div
            key={card.label}
            style={{
              padding: '24px',
              borderRadius: '16px',
              background: card.bg,
            }}
          >
            <p style={{
              fontSize: '13px',
              color: card.color,
              marginBottom: '8px',
              fontWeight: '500',
            }}>
              {card.label}
            </p>
            <p style={{
              fontSize: '28px',
              fontWeight: '800',
              color: card.color,
            }}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '40px',
      }}>
        <Link
          to="/admin/products"
          style={{
            padding: '24px',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            textDecoration: 'none',
            color: '#111111',
            display: 'block',
          }}
        >
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '6px',
          }}>
            Manage Products
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#718096',
          }}>
            Add, edit or delete products
          </p>
        </Link>

        <Link
          to="/admin/orders"
          style={{
            padding: '24px',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            textDecoration: 'none',
            color: '#111111',
            display: 'block',
          }}
        >
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '6px',
          }}>
            Manage Orders
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#718096',
          }}>
            Update order status
          </p>
        </Link>
      </div>

      {/* Recent Orders */}
      <div style={{
        padding: '28px',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        marginBottom: '32px',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
          }}>
            Recent Orders
          </h2>
          <Link
            to="/admin/orders"
            style={{
              fontSize: '14px',
              color: '#2563eb',
              textDecoration: 'none',
            }}
          >
            View All →
          </Link>
        </div>

        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '14px',
        }}>
          <thead>
            <tr style={{ background: '#f7fafc' }}>
              {['Order ID', 'Customer', 'Total',
                'Status', 'Date'].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '10px 16px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#4a5568',
                    borderBottom: '1px solid #e2e8f0',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stats.recentOrders.map((order) => (
              <tr
                key={order._id}
                style={{
                  borderBottom: '1px solid #f7fafc',
                }}
              >
                <td style={{ padding: '12px 16px',
                  fontFamily: 'monospace', fontSize: '13px' }}>
                  #{order._id.slice(-8).toUpperCase()}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  {order.user?.name || 'N/A'}
                </td>
                <td style={{ padding: '12px 16px',
                  fontWeight: '600' }}>
                  ₹{order.totalPrice}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background:
                      order.orderStatus === 'delivered'
                        ? '#dcfce7'
                        : order.orderStatus === 'shipped'
                        ? '#dbeafe'
                        : '#fef3c7',
                    color:
                      order.orderStatus === 'delivered'
                        ? '#16a34a'
                        : order.orderStatus === 'shipped'
                        ? '#2563eb'
                        : '#d97706',
                  }}>
                    {order.orderStatus}
                  </span>
                </td>
                <td style={{ padding: '12px 16px',
                  color: '#718096', fontSize: '13px' }}>
                  {new Date(order.createdAt)
                    .toLocaleDateString('en-IN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Low Stock Warning */}
      {stats.lowStock.length > 0 && (
        <div style={{
          padding: '20px 24px',
          background: '#fff7ed',
          border: '1px solid #fed7aa',
          borderRadius: '12px',
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#c2410c',
            marginBottom: '12px',
          }}>
            ⚠ Low Stock Alert
          </h3>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}>
            {stats.lowStock.map((p) => (
              <div
                key={p._id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '14px',
                }}
              >
                <span>{p.name}</span>
                <span style={{
                  fontWeight: '600',
                  color: p.stock === 0
                    ? '#dc2626' : '#d97706',
                }}>
                  {p.stock === 0
                    ? 'Out of Stock'
                    : `${p.stock} left`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}

export default Dashboard
