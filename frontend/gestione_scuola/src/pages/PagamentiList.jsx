import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal, Button, Form } from 'react-bootstrap'
import apiClient from '../api/apiClient'
import AdminNavbar from '../components/AdminNavbar'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { registerLocale } from 'react-datepicker'
import it from 'date-fns/locale/it'

registerLocale('it', it)

const PagamentiList = () => {
  const [pagamenti, setPagamenti] = useState([])
  const [studenti, setStudenti] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [studenteId, setStudenteId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    studenteId: '',
    dataPagamento: new Date(),
    importo: '',
    mensilitaSaldata: '',
    metodoPagamento: 'CARTA',
    numeroRicevuta: '',
    note: '',
  })

  const anno = selectedDate.getFullYear()
  const mese = String(selectedDate.getMonth() + 1).padStart(2, '0')

  useEffect(() => {
    fetchPagamenti()
    fetchStudenti()
  }, [anno, mese, studenteId])

  const fetchPagamenti = async () => {
    setLoading(true)
    try {
      const response = await apiClient.get('/pagamenti', {
        params: { anno, mese, studenteId },
      })
      setPagamenti(response.data)
    } catch (error) {
      setError('Errore nel caricamento dei pagamenti.', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStudenti = async () => {
    try {
      const response = await apiClient.get('/studenti')
      setStudenti(response.data)
    } catch (error) {
      console.error('❌ Errore nel recupero degli studenti:', error)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await apiClient.post('/pagamenti', {
        ...formData,
        dataPagamento: formData.dataPagamento.toISOString().split('T')[0],
      })
      setShowModal(false)
      await fetchPagamenti()
    } catch (error) {
      setError(error.response?.data?.message || 'Errore generico.')
    }
  }

  const eliminaPagamento = async (id) => {
    if (window.confirm('Vuoi eliminare questo pagamento?')) {
      try {
        await apiClient.delete(`/pagamenti/${id}`)
        fetchPagamenti()
      } catch (error) {
        setError('Errore nella cancellazione del pagamento.', error)
      }
    }
  }

  return (
    <>
      <AdminNavbar />
      <div className="container mt-4">
        <h2 className="text-center mb-4">💰 Lista Pagamenti</h2>

        {loading && <p className="text-center">⏳ Caricamento in corso...</p>}
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">📆 Filtra per Data</label>
            <div>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="MMMM yyyy"
                showMonthYearPicker
                locale="it"
                className="form-control text-start fw-bold"
              />
            </div>
          </div>

          <div className="col-md-6">
            <label className="form-label">🎓 Filtra per Studente</label>
            <Form.Select
              value={studenteId}
              onChange={(e) => setStudenteId(e.target.value)}
            >
              <option value="">Tutti gli studenti</option>
              {studenti.map((studente) => (
                <option key={studente.id} value={studente.id}>
                  {studente.nome} {studente.cognome}
                </option>
              ))}
            </Form.Select>
          </div>
        </div>

        <div className="mb-3 text-end">
          <button
            className="btn btn-success"
            onClick={() => setShowModal(true)}
          >
            ➕ Aggiungi Pagamento
          </button>
        </div>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>Data</th>
              <th>Importo</th>
              <th>Studente</th>
              <th>Mensilità</th>
              <th>Metodo</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {pagamenti.map((pagamento) => (
              <tr key={pagamento.id}>
                <td>{pagamento.dataPagamento}</td>
                <td>€ {pagamento.importo}</td>
                <td>{pagamento.studenteNome}</td>
                <td>{pagamento.mensilitaSaldata}</td>
                <td>{pagamento.metodoPagamento}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => navigate(`/pagamenti/${pagamento.id}`)}
                  >
                    ✏️ Modifica
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => eliminaPagamento(pagamento.id)}
                  >
                    🗑 Elimina
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Aggiungi Pagamento</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>📆 Data Pagamento</Form.Label>
                <DatePicker
                  selected={formData.dataPagamento}
                  onChange={(date) =>
                    setFormData({ ...formData, dataPagamento: date })
                  }
                  dateFormat="yyyy-MM-dd"
                  locale="it"
                  className="form-control"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Numero Ricevuta</Form.Label>
                <Form.Control
                  type="text"
                  name="numeroRicevuta"
                  value={formData.numeroRicevuta}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Note</Form.Label>
                <Form.Control
                  as="textarea"
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                />
              </Form.Group>

              <Button type="submit" variant="success">
                ✅ Aggiungi Pagamento
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  )
}

export default PagamentiList
