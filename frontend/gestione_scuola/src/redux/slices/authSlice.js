import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null, // Dati base dell'utente loggato
  token: localStorage.getItem('token') || null,
  teacherDetails: null, // Dati completi dell'insegnante
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      localStorage.setItem('token', action.payload.token)
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.teacherDetails = null
      localStorage.removeItem('token')
    },
    setTeacherDetails: (state, action) => {
      state.teacherDetails = action.payload // Memorizziamo i dettagli insegnante
    },
  },
})

export const { loginSuccess, logout, setTeacherDetails } = authSlice.actions
export default authSlice.reducer
