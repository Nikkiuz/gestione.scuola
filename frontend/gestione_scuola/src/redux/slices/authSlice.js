import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  token: localStorage.getItem('token') || null,
  role: localStorage.getItem('role') || null,
  userId: localStorage.getItem('userId') || null,
  teacherDetails: null, // Sarà riempito in Login.js se il ruolo è INSEGNANTE
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

      // 🔹 Salva nel localStorage
      localStorage.setItem('token', token)
      localStorage.setItem('role', role)
      localStorage.setItem('userId', userId)
    },
    logout: (state) => {
      state.token = null
      state.role = null
      state.userId = null
      state.teacherDetails = null

      // 🔹 Cancella tutto dal localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      localStorage.removeItem('userId')
    },
    setTeacherDetails: (state, action) => {
      state.teacherDetails = action.payload
    },
  },
})

export const { loginSuccess, logout, setTeacherDetails } = authSlice.actions
export default authSlice.reducer
