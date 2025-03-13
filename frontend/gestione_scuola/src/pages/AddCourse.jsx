import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/apiClient'
import AdminNavbar from '../components/AdminNavbar'

const AddCourse = () => {
  const navigate = useNavigate()
  const [insegnanti, setInsegnanti] = useState([])
  const [aule, setAule] = useState([])
  const [formData, setFormData] = useState({
    lingua: '',
    livello: '',
    insegnanteId: '',
    aulaId: '',
    giorno: '',
    orario: '',
    secondoGiorno: '',
    secondoOrario: '',
    frequenza: '1 volta a settimana',
    studentiIds: [],
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [insegnantiRes, auleRes] = await Promise.all([
        apiClient.get('/insegnanti'),
        apiClient.get('/aule'),
      ])
      setInsegnanti(insegnantiRes.data)
      setAule(auleRes.data)
    } catch (error) {
      console.error('Errore nel caricamento dati', error)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await apiClient.post('/corsi', formData)
      navigate('/corsi')
    } catch (error) {
      console.error('Errore nella creazione del corso', error)
    }
  }

  return (
    <>
      <AdminNavbar />
      <div className="container mt-4">
        <h2 className="text-center mb-4">➕ Aggiungi Corso</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Lingua</label>
            <input
              type="text"
              className="form-control"
              name="lingua"
              value={formData.lingua}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Livello</label>
            <input
              type="text"
              className="form-control"
              name="livello"
              value={formData.livello}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Insegnante</label>
            <select
              className="form-select"
              name="insegnanteId"
              value={formData.insegnanteId}
              onChange={handleChange}
              required
            >
              <option value="">Seleziona un insegnante</option>
              {insegnanti.map((insegnante) => (
                <option key={insegnante.id} value={insegnante.id}>
                  {insegnante.nome} {insegnante.cognome}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Aula</label>
            <select
              className="form-select"
              name="aulaId"
              value={formData.aulaId}
              onChange={handleChange}
              required
            >
              <option value="">Seleziona un'aula</option>
              {aule.map((aula) => (
                <option key={aula.id} value={aula.id}>
                  {aula.nome} (Max {aula.capienzaMax} studenti)
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Frequenza</label>
            <select
              className="form-select"
              name="frequenza"
              value={formData.frequenza}
              onChange={handleChange}
              required
            >
              <option value="1 volta a settimana">1 volta a settimana</option>
              <option value="2 volte a settimana">2 volte a settimana</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Giorno</label>
            <input
              type="text"
              className="form-control"
              name="giorno"
              value={formData.giorno}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Orario</label>
            <input
              type="text"
              className="form-control"
              name="orario"
              value={formData.orario}
              onChange={handleChange}
              required
            />
          </div>

          {formData.frequenza === '2 volte a settimana' && (
            <>
              <div className="mb-3">
                <label className="form-label">Secondo Giorno</label>
                <input
                  type="text"
                  className="form-control"
                  name="secondoGiorno"
                  value={formData.secondoGiorno}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Secondo Orario</label>
                <input
                  type="text"
                  className="form-control"
                  name="secondoOrario"
                  value={formData.secondoOrario}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          <button type="submit" className="btn btn-success w-100">
            ✅ Aggiungi Corso
          </button>
        </form>
      </div>
    </>
  )
}

export default AddCourse
