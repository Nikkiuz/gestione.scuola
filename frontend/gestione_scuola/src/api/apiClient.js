import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
})

// 🔥 Intercettore per aggiungere automaticamente il token JWT a ogni richiesta
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') // Recupera il token dal localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}` // Aggiunge il token all'header
  }
  return config
})

export default apiClient
