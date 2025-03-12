import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/apiClient'

const AddTeacher = () => {
  const navigate = useNavigate()
  const [insegnante, setInsegnante] = useState({
    nome: '',
    email: '',
    giorniDisponibili: [],
    fasceOrarieDisponibili: [],
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setInsegnante({ ...insegnante, [e.target.name]: e.target.value })
  }

  const handleArrayChange = (e, key) => {
    setInsegnante({ ...insegnante, [key]: e.target.value.split(', ') })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      await apiClient.post('/insegnanti', insegnante)
      navigate('/insegnanti') // Torna alla lista insegnanti dopo la creazione
    } catch (error) {
      console.error('Errore nella creazione dell’insegnante', error)
      setError('Errore nella creazione dell’insegnante.')
    }
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">👨‍🏫 Aggiungi Nuovo Insegnante</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nome</label>
          <input
            type="text"
            name="nome"
            className="form-control"
            value={insegnante.nome}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={insegnante.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Giorni Disponibili</label>
          <input
            type="text"
            name="giorniDisponibili"
            className="form-control"
            value={insegnante.giorniDisponibili.join(', ')}
            onChange={(e) => handleArrayChange(e, 'giorniDisponibili')}
            required
          />
          <small className="text-muted">Es: Lunedì, Mercoledì</small>
        </div>

        <div className="mb-3">
          <label className="form-label">Orari Disponibili</label>
          <input
            type="text"
            name="fasceOrarieDisponibili"
            className="form-control"
            value={insegnante.fasceOrarieDisponibili.join(', ')}
            onChange={(e) => handleArrayChange(e, 'fasceOrarieDisponibili')}
            required
          />
          <small className="text-muted">Es: 16:00-18:00, 18:00-20:00</small>
        </div>

        <button type="submit" className="btn btn-success">
          ➕ Aggiungi Insegnante
        </button>

        <button
          type="button"
          className="btn btn-secondary ms-3"
          onClick={() => navigate('/insegnanti')}
        >
          🔙 Torna alla lista
        </button>
      </form>
    </div>
  )
}

export default AddTeacher
