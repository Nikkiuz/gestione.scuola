import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiClient from '../api/apiClient'

// ✅ Recupera dettagli insegnante
export const fetchTeacherDetails = createAsyncThunk(
  'auth/fetchTeacherDetails',
  async (_, thunkAPI) => {
    try {
      const response = await apiClient.get('/insegnanti/me')
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || 'Errore nel recupero dettagli'
      )
    }
  }
)

const initialState = {
  user: null,
  token: null,
  role: null,
  userId: null,
  teacherDetails: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { token, role, userId } = action.payload
      state.token = token
      state.role = role
      state.userId = userId || null
      state.user = { role, id: userId || null }
    },
    logout: (state) => {
      state.token = null
      state.user = null
      state.role = null
      state.userId = null
      state.teacherDetails = null
      localStorage.removeItem('token')
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTeacherDetails.fulfilled, (state, action) => {
      state.teacherDetails = action.payload
    })
  },
})

export const { loginSuccess, logout } = authSlice.actions
export default authSlice.reducer
