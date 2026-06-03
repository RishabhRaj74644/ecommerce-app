import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/axios.js'

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/login', credentials)
      localStorage.setItem('auth', JSON.stringify(data))
      return data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Login failed'
      )
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/register', userData)
      localStorage.setItem('auth', JSON.stringify(data))
      return data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Registration failed'
      )
    }
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    await api.post('/auth/logout')
    localStorage.removeItem('auth')
  }
)

const savedAuth = JSON.parse(
  localStorage.getItem('auth') || 'null'
)

const initialState = {
  user: savedAuth || null,
  accessToken: savedAuth?.accessToken || null,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.accessToken = action.payload.accessToken
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.accessToken = action.payload.accessToken
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.accessToken = null
      })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer