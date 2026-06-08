import axios from 'axios'
import { toast } from 'react-toastify'

const BACKEND_URL = 'https://ecommerce-backend-1znr.onrender.com/api'

const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const state = JSON.parse(
    localStorage.getItem('auth') || '{}'
  )
  const token = state?.accessToken

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (!error.response) {
      toast.error('Network error — check your connection')
      return Promise.reject(error)
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true
      try {
        const { data } = await axios.post(
          `${BACKEND_URL}/auth/refresh-token`,  // ← FIXED
          {},
          { withCredentials: true }
        )
        const state = JSON.parse(
          localStorage.getItem('auth') || '{}'
        )
        state.accessToken = data.accessToken
        localStorage.setItem('auth', JSON.stringify(state))

        originalRequest.headers.Authorization =
          `Bearer ${data.accessToken}`

        return api(originalRequest)
      } catch {
        localStorage.removeItem('auth')
        window.location.href = '/login'
      }
    }

    if (error.response?.status === 403) {
      toast.error('Access denied!')
      window.location.href = '/'
    }

    if (error.response?.status === 429) {
      toast.error('Too many requests! Please wait.')
    }

    if (error.response?.status === 500) {
      toast.error('Server error! Please try again.')
    }

    return Promise.reject(error)
  }
)

export default api