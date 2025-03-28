import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../redux/slices/authSlice.js'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/apiClient.js'
import FullscreenSpinner from '../components/FullScreenSpinner.jsx'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogin = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await apiClient.post('/auth/login', { email, password })
      const { token, userId } = response.data

      if (!token || !userId) {
        setError('Errore nel login. Riprova.')
        setLoading(false)
        return
      }

      localStorage.setItem('token', token)
      dispatch(loginSuccess({ token, userId }))
      navigate('/admin-dashboard')
    } catch (error) {
      console.error('❌ Errore login:', error)
      setError('Email o password errati')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleLogin()
  }

  return (
    <>
      {loading && <FullscreenSpinner message="Accesso in corso..." />}

      <div
        className="container d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: '100vh' }}
      >
        {/* Titolo fuori dalla card */}
        <div className="text-center mb-4">
          <h2 className="fw-bold">Benvenuto!</h2>
          <p className="text-muted">Accedi per gestire la tua scuola</p>
        </div>

        {/* Card login */}
        <div className="card shadow p-4 w-100" style={{ maxWidth: '400px' }}>
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Inserisci la tua email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Inserisci la password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 d-flex justify-content-center align-items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Accesso...
                </>
              ) : (
                'Accedi'
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Login
