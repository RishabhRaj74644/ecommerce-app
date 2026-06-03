import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { registerUser, clearError } from '../store/authSlice.js'
import { toast } from 'react-toastify'
import useAuth from '../hooks/useAuth.js'

const Register = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, loading, error } = useAuth()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [isAuthenticated, error])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (form.password !== form.confirmPassword) {
      toast.error('Both passwords are  not  matched')
      return
    }

    if (form.password.length < 6) {
      toast.error('Password must be more than  6 characters ')
      return
    }

    try {
      await dispatch(registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
      })).unwrap()

      toast.success('Account Made.!')
      navigate('/')
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>

        <h1 style={{ fontSize: '26px', fontWeight: 'bold',
          marginBottom: '8px' }}>
          Make Account
        </h1>

        <p style={{ color: '#718096', marginBottom: '32px',
          fontSize: '14px' }}>
          Join with us
        </p>

        <form onSubmit={handleSubmit}>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Full Name</label>
            <input
              type="text"
              placeholder="Your Name "
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              style={inputStyle}
              required
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              placeholder="example@email.com"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              style={inputStyle}
              required
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              placeholder="Min 6 characters"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              style={inputStyle}
              required
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Confirm password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              style={inputStyle}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...buttonStyle,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Account is getting...' : 'Register'}
          </button>

        </form>

        <p style={{ textAlign: 'center', marginTop: '24px',
          fontSize: '14px', color: '#718096' }}>
          Already have account?{' '}
          <Link to="/login"
            style={{ color: '#111111', fontWeight: 'bold',
              textDecoration: 'none' }}>
            Login 
          </Link>
        </p>

      </div>
    </div>
  )
}

const pageStyle = {
  minHeight: '80vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '0 16px',
  background: '#f7fafc',
}

const cardStyle = {
  background: '#ffffff',
  padding: '40px',
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  width: '100%',
  maxWidth: '420px',
}

const labelStyle = {
  display: 'block',
  marginBottom: '6px',
  fontSize: '14px',
  fontWeight: '500',
  color: '#2d3748',
}

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  fontSize: '15px',
  outline: 'none',
  boxSizing: 'border-box',
}

const buttonStyle = {
  width: '100%',
  padding: '13px',
  background: '#111111',
  color: '#ffffff',
  border: 'none',
  borderRadius: '8px',
  fontSize: '15px',
  fontWeight: '600',
  cursor: 'pointer',
}

export default Register