import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal, Button, Form } from 'react-bootstrap'
import apiClient from '../api/apiClient'
import AdminNavbar from '../components/AdminNavbar'
import DatePicker from 'react-datepicker'
import ModalePagamento from '../components/ModalePagamento'
import 'react-datepicker/dist/react-datepicker.css'
import { registerLocale } from 'react-datepicker'
import it from 'date-fns/locale/it'
import CustomSpinner from '../components/CustomSpinner'

registerLocale('it', it)

const PagamentiList = () => {
  const [pagamenti, setPagamenti] = useState([])
  const [studenti, setStudenti] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [studenteId, setStudenteId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    id: '',
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
      setError(
        "Errore nel recupero degli studenti. Controlla la connessione o l'endpoint."
      )
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

const handleSubmit = async (e) => {
  e.preventDefault()
  setError('')
  try {
    if (isEditing) {
      await apiClient.put(`/pagamenti/${formData.id}`, {
        ...formData,
        dataPagamento: formData.dataPagamento.toISOString().split('T')[0],
      })
      alert('✅ Pagamento modificato con successo!')
      setShowModal(false)
      await fetchPagamenti()
    } else {
      await apiClient.post('/pagamenti', {
        ...formData,
        dataPagamento: formData.dataPagamento.toISOString().split('T')[0],
      })
    alert('✅ Pagamento aggiunto con successo!')
    setShowModal(false)
    fetchPagamenti()
    sessionStorage.setItem('refreshReport', 'true')

    }
  } catch (error) {
    console.error('❌ Errore:', error)
    alert('❌ Errore durante il salvataggio del pagamento.')
    setError(error.response?.data?.message || 'Errore generico.')
  }
}


const eliminaPagamento = async (id) => {
  if (window.confirm('Vuoi eliminare questo pagamento?')) {
    try {
      await apiClient.delete(`/pagamenti/${id}`)
      alert('✅ Pagamento eliminato con successo!')
      fetchPagamenti()
      sessionStorage.setItem('refreshReport', 'true') // Flag per report
    } catch (error) {
      console.error('❌ Errore nella cancellazione del pagamento:', error)
      setError('Errore nella cancellazione del pagamento.')
    }
  }
}

  const resetFormData = () => {
    setFormData({
      id: '',
      studenteId: '',
      dataPagamento: new Date(),
      importo: '',
      mensilitaSaldata: '',
      metodoPagamento: 'CARTA',
      numeroRicevuta: '',
      note: '',
    })
    setIsEditing(false)
  }

  return (
    <>
      <AdminNavbar />
      <div className="container pt-5 mt-5">
        <h2 className="text-center mb-4">💳 Lista Pagamenti</h2>

        {loading && (
          <CustomSpinner message="Caricamento pagamenti in corso..." />
        )}
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3 text-start">
          <button
            className="btn btn-success"
            onClick={() => {
              resetFormData()
              setShowModal(true)
            }}
          >
            ➕ Aggiungi Pagamento
          </button>
        </div>

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

        <div className="table-responsive-wrapper">
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
                    {/* Pulsante per visualizzare i dettagli del pagamento */}
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => navigate(`/pagamenti/${pagamento.id}`)} // Reindirizza alla pagina dei dettagli
                    >
                      📄 Dettagli
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
        </div>

        <ModalePagamento
          show={showModal}
          onHide={() => {
            setShowModal(false)
            resetFormData()
          }}
          pagamentoSelezionato={formData}
          setPagamentoSelezionato={setFormData}
          isEditing={isEditing}
          handleSubmit={handleSubmit}
          studenti={studenti}
          handleChange={handleChange} // Passa handleChange come prop
        />
      </div>
    </>
  )
}

export default PagamentiList
