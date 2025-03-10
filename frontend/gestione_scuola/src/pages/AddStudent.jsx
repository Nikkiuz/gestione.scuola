import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/apiClient'
import AdminNavbar from '../components/AdminNavbar'

const AddStudent = () => {
  const navigate = useNavigate()
  const [insegnanti, setInsegnanti] = useState([])
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    eta: '',
    linguaDaImparare: '',
    livello: '',
    giorniPreferiti: [],
    fasceOrariePreferite: [],
    corsoPrivato: false,
    frequenzaCorsoPrivato: 1,
    tipoCorsoGruppo: '1 volta a settimana',
    insegnanteId: '', // Nuovo campo per la preferenza insegnante
    tipologiaPagamento: '',
  })

  useEffect(() => {
    fetchInsegnanti()
  }, [])

  // Recupera la lista degli insegnanti per il menu a tendina
  const fetchInsegnanti = async () => {
    try {
      const response = await apiClient.get('/insegnanti')
      setInsegnanti(response.data)
    } catch (error) {
      console.error('Errore nel recupero degli insegnanti', error)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleMultiSelectChange = (e) => {
    const { name, options } = e.target
    const selectedValues = Array.from(options)
      .filter((opt) => opt.selected)
      .map((opt) => opt.value)
    setFormData({ ...formData, [name]: selectedValues })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await apiClient.post('/studenti', formData)
      navigate('/studenti')
    } catch (error) {
      console.error('Errore nella creazione dello studente', error)
    }
  }

  return (
    <>
      <AdminNavbar />
      <div className="container mt-4">
        <h2 className="text-center mb-4">➕ Aggiungi Studente</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nome</label>
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
            <label className="form-label">Cognome</label>
            <input
              type="text"
              className="form-control"
              name="cognome"
              value={formData.cognome}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Età</label>
            <input
              type="number"
              className="form-control"
              name="eta"
              value={formData.eta}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Lingua da Imparare</label>
            <input
              type="text"
              className="form-control"
              name="linguaDaImparare"
              value={formData.linguaDaImparare}
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

          {/* Selezione dei giorni preferiti */}
          <div className="mb-3">
            <label className="form-label">Giorni Preferiti</label>
            <select
              className="form-select"
              name="giorniPreferiti"
              multiple
              value={formData.giorniPreferiti}
              onChange={handleMultiSelectChange}
            >
              <option value="Lunedì">Lunedì</option>
              <option value="Martedì">Martedì</option>
              <option value="Mercoledì">Mercoledì</option>
              <option value="Giovedì">Giovedì</option>
              <option value="Venerdì">Venerdì</option>
              <option value="Sabato">Sabato</option>
            </select>
          </div>

          {/* Selezione delle fasce orarie preferite */}
          <div className="mb-3">
            <label className="form-label">Fasce Orarie Preferite</label>
            <select
              className="form-select"
              name="fasceOrariePreferite"
              multiple
              value={formData.fasceOrariePreferite}
              onChange={handleMultiSelectChange}
            >
              <option value="08:00-10:00">08:00-10:00</option>
              <option value="10:00-12:00">10:00-12:00</option>
              <option value="14:00-16:00">14:00-16:00</option>
              <option value="16:00-18:00">16:00-18:00</option>
            </select>
          </div>

          {/* Selezione dell'insegnante preferito */}
          <div className="mb-3">
            <label className="form-label">Insegnante Preferito</label>
            <select
              className="form-select"
              name="insegnanteId"
              value={formData.insegnanteId}
              onChange={handleChange}
            >
              <option value="">Nessuna preferenza</option>
              {insegnanti.map((insegnante) => (
                <option key={insegnante.id} value={insegnante.id}>
                  {insegnante.nome} {insegnante.cognome}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Tipologia di Pagamento</label>
            <input
              type="text"
              className="form-control"
              name="tipologiaPagamento"
              value={formData.tipologiaPagamento}
              onChange={handleChange}
              required
            />
          </div>

          {/* Checkbox per corso privato */}
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="corsoPrivato"
              name="corsoPrivato"
              checked={formData.corsoPrivato}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="corsoPrivato">
              Corso Privato
            </label>
          </div>

          {/* Frequenza corso privato */}
          {formData.corsoPrivato && (
            <div className="mb-3">
              <label className="form-label">Ore Settimanali</label>
              <input
                type="number"
                className="form-control"
                name="frequenzaCorsoPrivato"
                value={formData.frequenzaCorsoPrivato}
                onChange={handleChange}
                min="1"
                required
              />
            </div>
          )}

          {/* Pulsante di invio */}
          <button type="submit" className="btn btn-success w-100">
            ✅ Aggiungi Studente
          </button>
        </form>
      </div>
    </>
  )
}

export default AddStudent
