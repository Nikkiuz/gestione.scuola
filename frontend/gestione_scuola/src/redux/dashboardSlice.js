import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  speseMensili: 0,
  corsiInDifficolta: [],
  studentiSenzaCorso: [],
  corsiPieni: [],
  loading: false,
  error: null,
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setSpeseMensili: (state, action) => {
      state.speseMensili = action.payload
    },
    setCorsiInDifficolta: (state, action) => {
      state.corsiInDifficolta = action.payload
    },
    setStudentiSenzaCorso: (state, action) => {
      state.studentiSenzaCorso = action.payload
    },
    setCorsiPieni: (state, action) => {
      state.corsiPieni = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const {
  setSpeseMensili,
  setCorsiInDifficolta,
  setStudentiSenzaCorso,
  setCorsiPieni,
  setLoading,
  setError,
} = dashboardSlice.actions
export default dashboardSlice.reducer
