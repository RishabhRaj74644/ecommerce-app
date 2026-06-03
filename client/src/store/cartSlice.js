import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api/axios.js'

export const fetchCart = createAsyncThunk(
  'cart/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/cart')
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message)
    }
  }
)

export const addToCart = createAsyncThunk(
  'cart/add',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/cart/add', payload)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message)
    }
  }
)

export const updateCartItem = createAsyncThunk(
  'cart/update',
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/cart/${itemId}`, { quantity })
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message)
    }
  }
)

export const removeFromCart = createAsyncThunk(
  'cart/remove',
  async (itemId, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/cart/${itemId}`)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message)
    }
  }
)

export const clearCart = createAsyncThunk(
  'cart/clear',
  async (_, { rejectWithValue }) => {
    try {
      await api.delete('/cart')
    } catch (err) {
      return rejectWithValue(err.response?.data?.message)
    }
  }
)

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalAmount: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    const handleCartSuccess = (state, action) => {
      state.loading = false
      state.items = action.payload?.items || []
      state.totalAmount = action.payload?.totalAmount || 0
    }

    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchCart.fulfilled, handleCartSuccess)

      .addCase(addToCart.fulfilled, handleCartSuccess)

      .addCase(updateCartItem.fulfilled, handleCartSuccess)

      .addCase(removeFromCart.fulfilled, handleCartSuccess)

      .addCase(clearCart.fulfilled, (state) => {
        state.items = []
        state.totalAmount = 0
        state.loading = false
      })
  },
})

export default cartSlice.reducer