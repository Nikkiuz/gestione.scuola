import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  token: null,
  userId: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      console.log('🔄 Reducer loginSuccess chiamato con:', action.payload) // 🔍 Debug
      state.token = action.payload.token
      state.userId = action.payload.userId
      state.user = { id: action.payload.userId }
      console.log('✅ Stato Redux aggiornato:', state) // 🔍 Debug
    },
    logout: (state) => {
      console.log('🚪 Logout effettuato')
      state.token = null
      state.user = null
      state.userId = null
      localStorage.removeItem('token')
    },
  },
})

export const { loginSuccess, logout } = authSlice.actions
export default authSlice.reducer
