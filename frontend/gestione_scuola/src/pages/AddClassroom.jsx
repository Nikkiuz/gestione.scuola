import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/apiClient'
import AdminNavbar from '../components/AdminNavbar'

const AddClassroom = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    nome: '',
    capienzaMax: '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await apiClient.post('/aule', formData)
      navigate('/aule') // Reindirizza alla lista delle aule
    } catch (error) {
      console.error('Errore nella creazione dell’aula', error)
    }
  }

  return (
    <>
      <AdminNavbar />
      <div className="container mt-4">
        <h2 className="text-center mb-4">➕ Aggiungi Aula</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nome Aula</label>
            <input
              type="text"
              className="form-control"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Capienza Massima</label>
            <input
              type="number"
              className="form-control"
              name="capienzaMax"
              value={formData.capienzaMax}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-success w-100">
            ✅ Aggiungi Aula
          </button>
        </form>
      </div>
    </>
  )
}

export default AddClassroom
