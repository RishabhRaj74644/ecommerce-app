import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import api from '../api/axios.js'
import useAuth from '../hooks/useAuth.js'
import { loginUser } from '../store/authSlice.js'

const Profile = () => {
  const dispatch    = useDispatch()
  const { user }    = useAuth()

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  })

  const [passForm, setPassForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [profileLoading, setProfileLoading] = useState(false)
  const [passLoading, setPassLoading]       = useState(false)

  const handleProfileUpdate = async (e) => {
    e.preventDefault()

    if (!profileForm.name || !profileForm.email) {
      toast.error('Both Name and  email needed')
      return
    }

    setProfileLoading(true)
    try {
      const { data } = await api.put(
        '/users/profile',
        profileForm
      )

      toast.success('Profile updated!')
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Not Updated'
      )
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()

    if (passForm.newPassword !== passForm.confirmPassword) {
      toast.error('Both passwords  not matched ')
      return
    }

    if (passForm.newPassword.length < 6) {
      toast.error('Password must be more than 6 characters ')
      return
    }

    setPassLoading(true)
    try {
      await api.put('/users/change-password', {
        currentPassword: passForm.currentPassword,
        newPassword: passForm.newPassword,
      })

      toast.success('Password changed!')
      setPassForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Password not changed'
      )
    } finally {
      setPassLoading(false)
    }
  }

  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '40px 24px',
    }}>

      <h1 style={{
        fontSize: '26px',
        fontWeight: '700',
        marginBottom: '8px',
      }}>
        My Profile
      </h1>

      <p style={{
        color: '#718096',
        marginBottom: '32px',
        fontSize: '14px',
      }}>
        Manage your personal imformation
      </p>

      {/* Profile Avatar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '24px',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        marginBottom: '24px',
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: '#111111',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontSize: '24px',
          fontWeight: '700',
          flexShrink: 0,
        }}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p style={{
            fontSize: '18px',
            fontWeight: '600',
          }}>
            {user?.name}
          </p>
          <p style={{
            fontSize: '14px',
            color: '#718096',
          }}>
            {user?.email}
          </p>
          <span style={{
            display: 'inline-block',
            marginTop: '4px',
            padding: '2px 10px',
            background: user?.role === 'admin'
              ? '#fef3c7' : '#e6f7ff',
            color: user?.role === 'admin'
              ? '#d97706' : '#2563eb',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '500',
          }}>
            {user?.role === 'admin' ? 'Admin' : 'User'}
          </span>
        </div>
      </div>

      {/* Profile Update Form */}
      <div style={{
        padding: '28px',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        marginBottom: '24px',
      }}>
        <h2 style={{
          fontSize: '17px',
          fontWeight: '600',
          marginBottom: '20px',
        }}>
          Personal Information
        </h2>

        <form onSubmit={handleProfileUpdate}>
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Full Name</label>
            <input
              value={profileForm.name}
              onChange={(e) =>
                setProfileForm({
                  ...profileForm,
                  name: e.target.value,
                })
              }
              style={inputStyle}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={profileForm.email}
              onChange={(e) =>
                setProfileForm({
                  ...profileForm,
                  email: e.target.value,
                })
              }
              style={inputStyle}
              required
            />
          </div>

          <button
            type="submit"
            disabled={profileLoading}
            style={{
              ...btnStyle,
              opacity: profileLoading ? 0.7 : 1,
            }}
          >
            {profileLoading
              ? 'Update is getting...'
              : 'Update Profile'}
          </button>
        </form>
      </div>

      {/* Password Change Form */}
      <div style={{
        padding: '28px',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
      }}>
        <h2 style={{
          fontSize: '17px',
          fontWeight: '600',
          marginBottom: '20px',
        }}>
          Change password
        </h2>

        <form onSubmit={handlePasswordChange}>
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Current Password</label>
            <input
              type="password"
              value={passForm.currentPassword}
              onChange={(e) =>
                setPassForm({
                  ...passForm,
                  currentPassword: e.target.value,
                })
              }
              style={inputStyle}
              required
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>New Password</label>
            <input
              type="password"
              placeholder="Min 6 characters"
              value={passForm.newPassword}
              onChange={(e) =>
                setPassForm({
                  ...passForm,
                  newPassword: e.target.value,
                })
              }
              style={inputStyle}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>
              Confirm new Password
            </label>
            <input
              type="password"
              value={passForm.confirmPassword}
              onChange={(e) =>
                setPassForm({
                  ...passForm,
                  confirmPassword: e.target.value,
                })
              }
              style={inputStyle}
              required
            />
          </div>

          <button
            type="submit"
            disabled={passLoading}
            style={{
              ...btnStyle,
              background: '#e53e3e',
              opacity: passLoading ? 0.7 : 1,
            }}
          >
            {passLoading
              ? 'Change is getting...'
              : 'Change your Password'}
          </button>
        </form>
      </div>

    </div>
  )
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
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
}

const btnStyle = {
  width: '100%',
  padding: '12px',
  background: '#111111',
  color: '#ffffff',
  border: 'none',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
}

export default Profile