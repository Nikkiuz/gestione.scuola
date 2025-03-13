import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../redux/slices/authSlice.js'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/apiClient.js'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      const response = await apiClient.post('/auth/login', { email, password })
      console.log('🔹 Dati ricevuti:', response.data) // Debug per i dati ricevuti

      const { token, userId } = response.data

      // Controllo errori sui dati ricevuti
      if (!token || !userId) {
        console.error('❌ Errore: Dati mancanti nel login')
        setError('Errore nel login. Riprova.')
        return
      }

      // Salva sempre il token nel localStorage
      localStorage.setItem('token', token)

      // Dispatch per salvare token e userId nello stato globale (Redux)
      dispatch(loginSuccess({ token, userId }))

      // Reindirizzamento diretto alla dashboard admin
      console.log('✅ Reindirizzamento a /admin-dashboard')
      navigate('/admin-dashboard')
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
            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
