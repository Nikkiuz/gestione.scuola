import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../redux/authSlice.js'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/apiClient.js'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const response = await apiClient.post('/auth/login', { email, password })
      const { token, user } = response.data

      // Salviamo il token
      if (rememberMe) {
        localStorage.setItem('token', token)
      }
      dispatch(loginSuccess({ user, token }))

      // Reindirizzamento in base al ruolo
      if (user.role === 'ADMIN') {
        navigate('/dashboard')
      } else if (user.role === 'INSEGNANTE') {
        navigate('/miei-corsi')
      }
    } catch (error) {
      console.error('Errore login:', error)
      setError('Email o password errati')
    }
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
