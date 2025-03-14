import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api', // 🔹 Base URL del backend
})

// 🔥 Intercettore per aggiungere il token JWT a tutte le richieste API
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') // ✅ Recupera il token salvato
    console.log('🔍 Token JWT inviato:', token) // 🔍 Debug: Stampiamo il token

    if (token) {
      config.headers.Authorization = `Bearer ${token}` // ✅ Aggiunge il token nell'header
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default apiClient
