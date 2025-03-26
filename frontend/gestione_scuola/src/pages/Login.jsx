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
      console.log('🔹 Dati ricevuti:', response.data) // 🔍 Debug

      const { token, userId } = response.data

      if (!token || !userId) {
        console.error('❌ Errore: Dati mancanti nel login')
        setError('Errore nel login. Riprova.')
        setLoading(false)
        return
      }

      localStorage.setItem('token', token)
      dispatch(loginSuccess({ token, userId }))

      console.log('✅ Token salvato:', localStorage.getItem('token')) // 🔍 Debug
      console.log('✅ Dispatch inviato a Redux') // 🔍 Debug

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

    <div className="container pt-5 mt-5">
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
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? '⏳ Accesso...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
    </>
  )
}

export default Login
