import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api', // 🔹 Base URL del backend
})

// 🔥 Intercettore per aggiungere il token JWT a tutte le richieste API
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') // ✅ Recupera il token salvato
    if (token) {
      config.headers.Authorization = `Bearer ${token}` // ✅ Aggiunge il token nell'header
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 🚨 Intercettore per gestire errori di autenticazione
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.log('📌 Errore in risposta:', error.response)
    }
    if (error.response && error.response.status === 401) {
      console.warn('❌ Token scaduto o non valido. Disconnessione forzata.')
      localStorage.removeItem('token')
      // window.location.href = '/login';
    }
    return Promise.reject(error)
  }
)

export default apiClient
