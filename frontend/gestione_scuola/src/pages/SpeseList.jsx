import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal, Button, Form } from 'react-bootstrap'
import apiClient from '../api/apiClient'
import AdminNavbar from '../components/AdminNavbar'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { registerLocale } from 'react-datepicker'
import it from 'date-fns/locale/it' // Localizzazione italiana

registerLocale('it', it)

const SpeseList = () => {
  const [spese, setSpese] = useState([])
  const [categoria, setCategoria] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    categoria: '',
    importo: '',
    descrizione: '',
    dataSpesa: new Date(),
  })

  const anno = selectedDate.getFullYear()
  const mese = String(selectedDate.getMonth() + 1).padStart(2, '0')

  useEffect(() => {
    fetchSpese()
  }, [anno, mese, categoria])

  const fetchSpese = async () => {
    setLoading(true)
    try {
      const response = await apiClient.get('/spese', {
        params: { anno, mese, categoria },
      })
      setSpese(response.data)
      console.log('📋 Spese aggiornate:', response.data)
    } catch (error) {
      console.error('❌ Errore nel recupero delle spese', error)
      setError('Errore nel caricamento delle spese.')
    } finally {
      setLoading(false)
    }
  }

  const eliminaSpesa = async (id) => {
    if (window.confirm('Vuoi eliminare questa spesa?')) {
      try {
        await apiClient.delete(`/spese/${id}`)
        fetchSpese()
      } catch (error) {
        console.error('❌ Errore nella cancellazione della spesa', error)
      }
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleDateChange = (date) => {
    setFormData({ ...formData, dataSpesa: date })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    console.log('📤 Dati inviati al backend:', formData)

    try {
      await apiClient.post('/spese', {
        ...formData,
        dataSpesa: formData.dataSpesa.toISOString().split('T')[0], // 👈 Formatta la data
      })
      console.log('✅ Spesa aggiunta con successo')
      setShowModal(false)
      fetchSpese()
      alert('✅ Spesa aggiunta con successo!')
    } catch (error) {
      console.error('❌ Errore nella creazione della spesa', error)
      if (error.response) {
        console.error('📩 Risposta dal server:', error.response.data)
      }
      setError(
        error.response
          ? JSON.stringify(error.response.data, null, 2)
          : 'Errore generico.'
      )
    }
  }

  return (
    <>
      <AdminNavbar />
      <div className="container mt-4">
        <h2 className="text-center mb-4">💰 Lista Spese</h2>

        {/* Pulsante per aggiungere una nuova spesa */}
        <div className="mb-3 text-end">
          <button
            className="btn btn-success"
            onClick={() => setShowModal(true)}
          >
            ➕ Aggiungi Spesa
          </button>
        </div>

        {/* 🔹 Selettori per filtro */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">📆 Filtra per Data</label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="MMMM yyyy"
              showMonthYearPicker
              locale="it"
              className="form-control text-center fw-bold"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">🎯 Filtra per Categoria</label>
            <select
              className="form-select"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="">Tutte</option>
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
        </div>

        {/* 🔹 Tabella Spese */}
        {loading ? (
          <p className="text-center">⏳ Caricamento in corso...</p>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Data</th>
                <th>Importo</th>
                <th>Categoria</th>
                <th>Descrizione</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {spese.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    📭 Nessuna spesa trovata per il periodo selezionato.
                  </td>
                </tr>
              ) : (
                spese.map((spesa) => (
                  <tr key={spesa.id}>
                    <td>{spesa.dataSpesa}</td>
                    <td>€ {spesa.importo}</td>
                    <td>{spesa.categoria}</td>
                    <td>{spesa.descrizione}</td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm me-2"
                        onClick={() => navigate(`/spese/${spesa.id}`)} // 👈 Naviga a SpesaDetail
                      >
                        ✏️ Modifica
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => eliminaSpesa(spesa.id)}
                      >
                        🗑 Elimina
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {/* 🔹 Modale di Aggiunta Spesa */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Aggiungi Spesa</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Categoria</Form.Label>
                <Form.Select
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
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Importo (€)</Form.Label>
                <Form.Control
                  type="number"
                  name="importo"
                  value={formData.importo}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>📆 Data Spesa</Form.Label>
                <DatePicker
                  selected={formData.dataSpesa}
                  onChange={handleDateChange}
                  dateFormat="dd/MM/yyyy"
                  locale="it"
                  className="form-control"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Descrizione</Form.Label>
                <Form.Control
                  type="text"
                  name="descrizione"
                  value={formData.descrizione}
                  onChange={handleChange}
                />
              </Form.Group>
              <Button type="submit" variant="success">
                ✅ Aggiungi Spesa
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  )
}

export default SpeseList
