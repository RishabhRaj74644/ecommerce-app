import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : '/api',
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

    // Network error
    if (!error.response) {
      toast.error('Network error — check your connection')
      return Promise.reject(error)
    }

    // 401 — Token expire
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true
      try {
        const { data } = await axios.post(
          '/api/auth/refresh-token',
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

    // 403 — Forbidden
    if (error.response?.status === 403) {
      toast.error('Access denied!')
      window.location.href = '/'
    }

    // 429 — Rate limit
    if (error.response?.status === 429) {
      toast.error('Too many requests! Please wait.')
    }

    // 500 — Server error
    if (error.response?.status === 500) {
      toast.error('Server error! Please try again.')
    }

    return Promise.reject(error)
  }
)

export default api