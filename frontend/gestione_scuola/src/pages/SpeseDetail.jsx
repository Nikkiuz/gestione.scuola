import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import apiClient from '../api/apiClient'
import AdminNavbar from '../components/AdminNavbar'

const SpeseDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [spesa, setSpesa] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modifica, setModifica] = useState(false)

  useEffect(() => {
    fetchSpesa()
  }, [])

  const fetchSpesa = async () => {
    try {
      const response = await apiClient.get(`/spese/${id}`)
      setSpesa(response.data)
    } catch (error) {
      console.error('Errore nel recupero della spesa', error)
      setError('Errore nel caricamento della spesa.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setSpesa({ ...spesa, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await apiClient.put(`/spese/${id}`, spesa)
      setModifica(false)
    } catch (error) {
      console.error('Errore nella modifica della spesa', error)
    }
  }

  const eliminaSpesa = async () => {
    if (window.confirm('Sei sicuro di voler eliminare questa spesa?')) {
      try {
        await apiClient.delete(`/spese/${id}`)
        navigate('/spese')
      } catch (error) {
        console.error('Errore nell’eliminazione della spesa', error)
      }
    }
  }

  if (loading) return <p>Caricamento in corso...</p>
  if (error) return <div className="alert alert-danger">{error}</div>

  return (
    <>
      <AdminNavbar />
      <div className="container mt-4">
        <h2 className="text-center mb-4">💰 Dettagli Spesa</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Importo</label>
            <input
              type="number"
              name="importo"
              className="form-control"
              value={spesa.importo}
              onChange={handleChange}
              disabled={!modifica}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Categoria</label>
            <select
              name="categoria"
              className="form-control"
              value={spesa.categoria}
              onChange={handleChange}
              disabled={!modifica}
            >
              <option value="BOLLETTE">Bollette</option>
              <option value="PULIZIA">Pulizia</option>
              <option value="MUTUO">Mutuo</option>
              <option value="CONTRIBUTI_INSEGNANTI">
                Contributi Insegnanti
              </option>
              <option value="CANCELLERIA">Cancelleria</option>
              <option value="COMMERCIALISTA">Commercialista</option>
              <option value="ALTRO">Altro</option>
            </select>
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
        </form>

        <button className="btn btn-danger mt-3" onClick={eliminaSpesa}>
          🗑 Elimina Spesa
        </button>
      </div>
    </>
  )
}

export default SpeseDetail
