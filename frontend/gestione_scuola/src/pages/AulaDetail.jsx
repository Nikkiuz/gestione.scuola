import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import apiClient from '../api/apiClient'
import AdminNavbar from '../components/AdminNavbar'

const AulaDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [aula, setAula] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modifica, setModifica] = useState(false)

  useEffect(() => {
    fetchAula()
  }, [])

  const fetchAula = async () => {
    try {
      const response = await apiClient.get(`/aule/${id}`)
      setAula(response.data)
    } catch (error) {
      console.error('Errore nel recupero dell’aula', error)
      setError('Errore nel caricamento dell’aula.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setAula({ ...aula, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await apiClient.put(`/aule/${id}`, aula)
      setModifica(false)
    } catch (error) {
      console.error('Errore nella modifica dell’aula', error)
    }
  }

  const eliminaAula = async () => {
    if (window.confirm('Sei sicuro di voler eliminare questa aula?')) {
      try {
        await apiClient.delete(`/aule/${id}`)
        navigate('/aule')
      } catch (error) {
        console.error('Errore nell’eliminazione dell’aula', error)
      }
    }
  }

  if (loading) return <p>Caricamento in corso...</p>
  if (error) return <div className="alert alert-danger">{error}</div>

  return (
    <>
      <AdminNavbar />
      <div className="container mt-4">
        <h2 className="text-center mb-4">🏫 Dettagli Aula</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nome</label>
            <input
              type="text"
              name="nome"
              className="form-control"
              value={aula.nome}
              onChange={handleChange}
              disabled={!modifica}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Capienza Massima</label>
            <input
              type="number"
              name="capienzaMax"
              className="form-control"
              value={aula.capienzaMax}
              onChange={handleChange}
              disabled={!modifica}
            />
          </div>

          {/* Pulsante per modificare */}
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
        </form>

        <button className="btn btn-danger mt-3" onClick={eliminaAula}>
          🗑 Elimina Aula
        </button>

        <button
          className="btn btn-secondary mt-3 ms-2"
          onClick={() => navigate('/aule')}
        >
          🔙 Torna alla lista
        </button>
      </div>
    </>
  )
}

export default AulaDetail
