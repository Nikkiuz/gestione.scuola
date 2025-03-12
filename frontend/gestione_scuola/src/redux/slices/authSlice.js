import { createSlice } from '@reduxjs/toolkit'

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
      console.log('🔄 Reducer loginSuccess chiamato con:', action.payload)
      state.token = action.payload.token
      state.role = action.payload.role
      state.userId = action.payload.userId || null
      state.user = {
        role: action.payload.role,
        id: action.payload.userId || null,
      }
      console.log('✅ Stato Redux aggiornato:', state) // 🔥 Debug
    },
    logout: (state) => {
      console.log('🚪 Logout effettuato')
      state.token = null
      state.user = null
      state.role = null
      state.userId = null
      state.teacherDetails = null
      localStorage.removeItem('token')
    },
    setTeacherDetails: (state, action) => {
      console.log('📌 Salvataggio dettagli insegnante:', action.payload)
      state.teacherDetails = action.payload
    },
  },
})

export const { loginSuccess, logout, setTeacherDetails } = authSlice.actions
export default authSlice.reducer
