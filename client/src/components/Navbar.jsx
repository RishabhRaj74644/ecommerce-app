import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../store/authSlice.js'
import { toast } from 'react-toastify'
import useAuth from '../hooks/useAuth.js'

const Navbar = () => {
  const dispatch   = useDispatch()
  const navigate   = useNavigate()
  const { isAuthenticated, isAdmin, user } = useAuth()

  const cartCount = useSelector(
    (state) => state.cart.items.length
  )

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap()
      toast.success('Logout successfully..!')
      navigate('/')
    } catch {
      toast.error('There is a Problem in Logout')
    }
  }

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      height: '64px',
      background: '#111111',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>

      <Link
        to="/"
        style={{
          color: '#ffffff',
          textDecoration: 'none',
          fontSize: '22px',
          fontWeight: 'bold',
        }}
      >
        ShopApp
      </Link>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
      }}>

        <Link to="/products" style={linkStyle}>
          Products
        </Link>

        <Link to="/cart" style={{
          ...linkStyle,
          position: 'relative',
        }}>
          Cart
          {cartCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-8px',
              right: '-12px',
              background: '#e53e3e',
              color: '#ffffff',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {cartCount}
            </span>
          )}
        </Link>

        {isAdmin && (
          <Link to="/admin" style={{
            ...linkStyle,
            color: '#f6ad55',
          }}>
            Admin
          </Link>
        )}

        {isAuthenticated ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}>
            <span style={{
              color: '#a0aec0',
              fontSize: '14px',
            }}>
              {user?.name}
            </span>
            <Link to="/profile" style={linkStyle}>
              Profile
            </Link>
            <Link to="/my-orders" style={linkStyle}>   {/* ← ADD KARO */}
              My Orders
            </Link>
            <button
              onClick={handleLogout}
              style={buttonStyle}
            >
              Logout
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/login" style={linkStyle}>
              Login
            </Link>
            <Link to="/register" style={{
              ...linkStyle,
              background: '#ffffff',
              color: '#111111',
              padding: '8px 16px',
              borderRadius: '8px',
            }}>
              Register
            </Link>
          </div>
        )}

      </div>
    </nav>
  )
}

const linkStyle = {
  color: '#ffffff',
  textDecoration: 'none',
  fontSize: '14px',
  position: 'relative',
}

const buttonStyle = {
  background: 'transparent',
  color: '#ffffff',
  border: '1px solid #ffffff',
  padding: '8px 16px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '14px',
}

export default Navbar