import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import apiClient from '../api/apiClient'
import AdminNavbar from '../components/AdminNavbar'

const AggiungiPagamento = () => {
  const { id } = useParams() // ID dello studente passato tramite URL
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    dataPagamento: '',
    importo: '',
    metodoPagamento: 'BONIFICO',
    mensilitaSaldata: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await apiClient.post('/pagamenti', {
        studenteId: id,
        ...formData,
      })
      navigate(`/studenti/${id}`) // Torna alla pagina dello studente
    } catch (error) {
      console.error('Errore nella registrazione del pagamento:', error)
      setError('Errore durante la registrazione del pagamento.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <AdminNavbar />
      <div className="container mt-4">
        <h2 className="text-center mb-4">➕ Aggiungi Pagamento</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="card shadow p-4">
          <div className="mb-3">
            <label className="form-label">📅 Data Pagamento</label>
            <input
              type="date"
              className="form-control"
              name="dataPagamento"
              value={formData.dataPagamento}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">💰 Importo (€)</label>
            <input
              type="number"
              className="form-control"
              name="importo"
              value={formData.importo}
              onChange={handleChange}
              required
              min="1"
              step="0.01"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">💳 Metodo di Pagamento</label>
            <select
              className="form-select"
              name="metodoPagamento"
              value={formData.metodoPagamento}
              onChange={handleChange}
              required
            >
              <option value="BONIFICO">Bonifico</option>
              <option value="CARTA">Carta</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">📆 Mensilità Saldata</label>
            <input
              type="text"
              className="form-control"
              name="mensilitaSaldata"
              value={formData.mensilitaSaldata}
              onChange={handleChange}
              placeholder="Es. Febbraio 2025"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-success w-100"
            disabled={loading}
          >
            {loading ? '⏳ Registrando...' : '✅ Registra Pagamento'}
          </button>
        </form>

        <button
          className="btn btn-secondary mt-3"
          onClick={() => navigate(`/studenti/${id}`)}
        >
          🔙 Torna allo Studente
        </button>
      </div>
    </>
  )
}

export default AggiungiPagamento
