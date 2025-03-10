import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import apiClient from '../api/apiClient'
import AdminNavbar from '../components/AdminNavbar'

const TeacherDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [insegnante, setInsegnante] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modifica, setModifica] = useState(false)
  const [corsiAssegnati, setCorsiAssegnati] = useState([])

  useEffect(() => {
    fetchInsegnante()
    fetchCorsiAssegnati()
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

  const fetchCorsiAssegnati = async () => {
    try {
      const response = await apiClient.get(`/corsi/insegnante/${id}`)
      setCorsiAssegnati(response.data)
    } catch (error) {
      console.error('Errore nel recupero dei corsi', error)
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

  const handleDelete = async () => {
    if (corsiAssegnati.length > 0) {
      alert(
        '⚠️ Questo insegnante ha ancora corsi attivi e non può essere eliminato.'
      )
      return
    }

    if (window.confirm('⚠️ Sei sicuro di voler eliminare questo insegnante?')) {
      try {
        await apiClient.delete(`/insegnanti/${id}`)
        navigate('/insegnanti')
      } catch (error) {
        console.error('Errore nella cancellazione dell’insegnante', error)
      }
    }
  }

  if (loading) return <p>Caricamento in corso...</p>
  if (error) return <div className="alert alert-danger">{error}</div>

  return (
    <>
      <AdminNavbar />
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

          <button
            type="button"
            className="btn btn-danger ms-3"
            onClick={handleDelete}
          >
            🗑 Elimina
          </button>
        </form>
      </div>
    </>
  )
}

export default TeacherDetail
