import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import apiClient from '../api/apiClient'

const TeacherDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [insegnante, setInsegnante] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modifica, setModifica] = useState(false)

  useEffect(() => {
    fetchInsegnante()
  }, [])

  const fetchInsegnante = async () => {
    try {
      const response = await apiClient.get(`/insegnanti/${id}`)
      setInsegnante(response.data)
    } catch (error) {
      console.error('Errore nel recupero dell’insegnante', error)
      setError('Errore nel caricamento dell’insegnante.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setInsegnante({ ...insegnante, [e.target.name]: e.target.value })
  }

  const handleArrayChange = (e, key) => {
    setInsegnante({ ...insegnante, [key]: e.target.value.split(', ') })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await apiClient.put(`/insegnanti/${id}`, insegnante)
      setModifica(false)
    } catch (error) {
      console.error('Errore nella modifica dell’insegnante', error)
    }
  }

  // Funzione per eliminare l'insegnante
  const handleDelete = async () => {
    if (
      window.confirm(
        '⚠️ Sei sicuro di voler eliminare questo insegnante? Questa operazione è irreversibile.'
      )
    ) {
      try {
        await apiClient.delete(`/insegnanti/${id}`)
        navigate('/insegnanti') // Torna alla lista dopo l'eliminazione
      } catch (error) {
        console.error('Errore nella cancellazione dell’insegnante', error)
      }
    }
  }

  if (loading) return <p>Caricamento in corso...</p>
  if (error) return <div className="alert alert-danger">{error}</div>

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">👨‍🏫 Dettagli Insegnante</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nome</label>
          <input
            type="text"
            name="nome"
            className="form-control"
            value={insegnante.nome}
            onChange={handleChange}
            disabled={!modifica}
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
            disabled={!modifica}
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
            disabled={!modifica}
          />
          <small className="text-muted">
            Inserisci i giorni separati da virgola (Es: Lunedì, Mercoledì)
          </small>
        </div>

        <div className="mb-3">
          <label className="form-label">Orari Disponibili</label>
          <input
            type="text"
            name="fasceOrarieDisponibili"
            className="form-control"
            value={insegnante.fasceOrarieDisponibili.join(', ')}
            onChange={(e) => handleArrayChange(e, 'fasceOrarieDisponibili')}
            disabled={!modifica}
          />
          <small className="text-muted">
            Inserisci gli orari separati da virgola (Es: 16:00-18:00,
            18:00-20:00)
          </small>
        </div>

        {modifica ? (
          <button type="submit" className="btn btn-success">
            💾 Salva Modifiche
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setModifica(true)}
          >
            ✏️ Modifica
          </button>
        )}

        {/* Pulsante per eliminare l'insegnante */}
        <button
          type="button"
          className="btn btn-danger ms-3"
          onClick={handleDelete}
        >
          🗑 Elimina
        </button>
      </form>

      <button
        className="btn btn-secondary mt-3"
        onClick={() => navigate('/insegnanti')}
      >
        🔙 Torna alla lista
      </button>
    </div>
  )
}

export default TeacherDetail
