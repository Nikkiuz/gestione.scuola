import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginSuccess, setTeacherDetails } from '../redux/slices/authSlice.js'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/apiClient.js'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      const response = await apiClient.post('/auth/login', { email, password })
      console.log('🔹 Dati ricevuti:', response.data) // Debug per i dati ricevuti

      const { token, role, userId } = response.data

      // Controllo errori sui dati ricevuti
      if (!token || !role) {
        console.error('❌ Errore: Dati mancanti nel login')
        setError('Errore nel login. Riprova.')
        return
      }

      // Salva sempre il token nel localStorage
      localStorage.setItem('token', token)

      // Dispatch per salvare token, ruolo e userId nello stato globale (Redux)
      dispatch(loginSuccess({ token, role, userId }))

      // Gestione reindirizzamento
      if (role === 'ADMIN') {
        console.log('✅ Reindirizzamento a /admin-dashboard')
        navigate('/admin-dashboard')
      } else if (role === 'INSEGNANTE') {
        if (!userId) {
          console.error('❌ Errore: userId mancante per insegnante')
          setError('Errore nel caricamento dei dati.')
          return
        }
        console.log('✅ Recupero dettagli insegnante...')
        try {
          const teacherResponse = await apiClient.get(`/insegnanti/${userId}`)
          dispatch(setTeacherDetails(teacherResponse.data))
          console.log('✅ Reindirizzamento a /teacher-dashboard')
          navigate('/teacher-dashboard')
        } catch (error) {
          console.error('❌ Errore nel recupero dettagli insegnante:', error)
          setError('Errore nel caricamento dei dati. Riprova.')
        }
      }
    } catch (error) {
      console.error('❌ Errore login:', error)
      setError('Email o password errati')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    handleLogin()
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <h2 className="text-center">Login</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label className="form-check-label">Ricordami</label>
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </form>
          <div className="mt-3 text-center">
            <a href="#">Dimenticato la password?</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
