import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiClient from '../api/apiClient'

// ✅ Recupera il totale delle spese mensili
export const fetchSpeseMensili = createAsyncThunk(
  'dashboard/fetchSpeseMensili',
  async (_, thunkAPI) => {
    try {
      const response = await apiClient.get('/spese/mensile')
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
  }
)

// ✅ Recupera i corsi con meno di 3 studenti
export const fetchCorsiInDifficolta = createAsyncThunk(
  'dashboard/fetchCorsiInDifficolta',
  async (_, thunkAPI) => {
    try {
      const response = await apiClient.get('/corsi')
      return response.data.filter((corso) => corso.studenti.length < 3)
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
  }
)

// ✅ Recupera gli studenti senza corso
export const fetchStudentiSenzaCorso = createAsyncThunk(
  'dashboard/fetchStudentiSenzaCorso',
  async (_, thunkAPI) => {
    try {
      const response = await apiClient.get('/studenti/senza-corso')
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
  }
)

// ✅ Recupera corsi pieni
export const fetchCorsiPieni = createAsyncThunk(
  'dashboard/fetchCorsiPieni',
  async (_, thunkAPI) => {
    try {
      const response = await apiClient.get('/corsi')
      return response.data.filter(
        (corso) => corso.studenti.length >= corso.aula.capienzaMax
      )
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
  }
)

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    speseMensili: 0,
    corsiInDifficolta: [],
    studentiSenzaCorso: [],
    corsiPieni: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpeseMensili.fulfilled, (state, action) => {
        state.speseMensili = action.payload.totale
      })
      .addCase(fetchCorsiInDifficolta.fulfilled, (state, action) => {
        state.corsiInDifficolta = action.payload
      })
      .addCase(fetchStudentiSenzaCorso.fulfilled, (state, action) => {
        state.studentiSenzaCorso = action.payload
      })
      .addCase(fetchCorsiPieni.fulfilled, (state, action) => {
        state.corsiPieni = action.payload
      })
      .addMatcher(
        (action) =>
          action.type.startsWith('dashboard/') &&
          action.type.endsWith('/pending'),
        (state) => {
          state.loading = true
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith('dashboard/') &&
          action.type.endsWith('/fulfilled'),
        (state) => {
          state.loading = false
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith('dashboard/') &&
          action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false
          state.error = action.payload
        }
      )
  },
})

export default dashboardSlice.reducer
