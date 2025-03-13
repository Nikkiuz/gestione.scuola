import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/apiClient'

const Register = () => {
  const [nome, setNome] = useState('')
  const [cognome, setCognome] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('INSEGNANTE') // Default: INSEGNANTE
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const navigate = useNavigate()

  const handleRegister = async () => {
    try {
      const response = await apiClient.post('/auth/register', {
        nome,
        cognome,
        email,
        password,
        role,
      })
      console.log('✅ Registrazione completata:', response.data)
      setSuccess(true)

      setTimeout(() => {
        navigate('/login')
      }, 2000) // Dopo 2 secondi, reindirizza al login
    } catch (error) {
      setError(error.response?.data?.message || 'Errore nella registrazione.')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    handleRegister()
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <h2 className="text-center">Registrati</h2>
          {success && (
            <div className="alert alert-success">
              ✅ Registrazione avvenuta con successo! Reindirizzamento...
            </div>
          )}
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nome</label>
              <input
                type="text"
                className="form-control"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Cognome</label>
              <input
                type="text"
                className="form-control"
                value={cognome}
                onChange={(e) => setCognome(e.target.value)}
                required
              />
            </div>
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
            <div className="mb-3">
              <label className="form-label">Ruolo</label>
              <select
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="INSEGNANTE">Insegnante</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Registrati
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
