import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/apiClient'
import AdminNavbar from '../components/AdminNavbar'

const AddExpense = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    categoria: '',
    importo: '',
    descrizione: '',
    dataSpesa: '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await apiClient.post('/spese', formData)
      navigate('/spese') // Reindirizza alla lista spese
    } catch (error) {
      console.error('Errore nella creazione della spesa', error)
    }
  }

  return (
    <>
      <AdminNavbar />
      <div className="container mt-4">
        <h2 className="text-center mb-4">➕ Aggiungi Spesa</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Categoria</label>
            <select
              className="form-select"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              required
            >
              <option value="">Seleziona una categoria</option>
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

          <div className="mb-3">
            <label className="form-label">Importo (€)</label>
            <input
              type="number"
              className="form-control"
              name="importo"
              value={formData.importo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Descrizione</label>
            <input
              type="text"
              className="form-control"
              name="descrizione"
              value={formData.descrizione}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Data</label>
            <input
              type="date"
              className="form-control"
              name="dataSpesa"
              value={formData.dataSpesa}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-success w-100">
            ✅ Aggiungi Spesa
          </button>
        </form>
      </div>
    </>
  )
}

export default AddExpense
