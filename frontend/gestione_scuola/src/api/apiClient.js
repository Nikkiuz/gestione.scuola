import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api', // URL del backend
  headers: {
    'Content-Type': 'application/json',
  },
})

// Funzione per aggiungere il token JWT a ogni richiesta
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') // Prendiamo il token dallo storage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default apiClient
