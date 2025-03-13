import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginSuccess, setTeacherDetails } from '../redux/slices/authSlice.js'
import { useNavigate, Link } from 'react-router-dom'
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
      console.log('🔹 Dati ricevuti:', response.data)

      const { token, role, userId } = response.data

      if (!token || !role) {
        setError('Errore nel login. Riprova.')
        return
      }

      if (rememberMe) {
        localStorage.setItem('token', token)
        localStorage.setItem('role', role)
        localStorage.setItem('userId', userId)
      }

      dispatch(loginSuccess({ token, role, userId }))

      if (role === 'ROLE_INSEGNANTE') {
        try {
          const teacherResponse = await apiClient.get('/insegnanti/me', {
            headers: { Authorization: `Bearer ${token}` },
          })
          dispatch(setTeacherDetails(teacherResponse.data))
        } catch (error) {
          console.error(
            'Errore nel recupero dettagli insegnante:',
            error.response?.data || error.message
          )
        }
      }

      navigate(
        role === 'ROLE_ADMIN' ? '/admin-dashboard' : '/teacher-dashboard'
      )
    } catch (error) {
      console.error('❌ Errore login:', error.response?.data || error.message)
      setError(
        error.response?.data?.message || 'Email o password errati. Riprova.'
      )
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
            <Link to="/register" className="btn btn-secondary">
              Registrati
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
