import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import apiClient from '../api/apiClient'
import AdminNavbar from '../components/AdminNavbar'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { registerLocale } from 'react-datepicker'
import it from 'date-fns/locale/it'

registerLocale('it', it)

const PagamentiDetail = () => {
  const { id } = useParams() // Ottieni l'ID del pagamento dall'URL
  const navigate = useNavigate() // Hook per la navigazione
  const [pagamento, setPagamento] = useState(null) // Stato per memorizzare i dettagli del pagamento
  const [studenti, setStudenti] = useState([]) // Stato per memorizzare la lista degli studenti
  const [loading, setLoading] = useState(true) // Stato per gestire il caricamento
  const [error, setError] = useState('') // Stato per gestire gli errori
  const [isEditing, setIsEditing] = useState(false) // Stato per gestire la modalità di modifica
  const [formData, setFormData] = useState({
    studenteId: '',
    dataPagamento: new Date(),
    importo: '',
    mensilitaSaldata: '',
    metodoPagamento: 'CARTA',
    numeroRicevuta: '',
    note: '',
  })

  // Effetto per caricare i dati del pagamento e degli studenti al montaggio del componente
  useEffect(() => {
    fetchPagamento()
    fetchStudenti()
  }, [])

  // Funzione per recuperare i dettagli del pagamento
  const fetchPagamento = async () => {
    try {
      const response = await apiClient.get(`/api/pagamenti/${id}`)
      setPagamento(response.data)

      // Imposta i dati nel form per la modifica
      setFormData({
        studenteId: response.data.studenteId,
        dataPagamento: new Date(response.data.dataPagamento),
        importo: response.data.importo,
        mensilitaSaldata: response.data.mensilitaSaldata,
        metodoPagamento: response.data.metodoPagamento,
        numeroRicevuta: response.data.numeroRicevuta,
        note: response.data.note || '',
      })
    } catch (error) {
      setError('Errore nel caricamento del pagamento.', error)
    } finally {
      setLoading(false)
    }
  }

  // Funzione per recuperare la lista degli studenti
  const fetchStudenti = async () => {
    try {
      const response = await apiClient.get('/api/studenti')
      setStudenti(response.data)
    } catch (error) {
      console.error('Errore nel recupero degli studenti', error)
    }
  }

  // Funzione per gestire le modifiche ai campi del form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Funzione per gestire l'invio del form
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await apiClient.put(`/api/pagamenti/${id}`, {
        ...formData,
        dataPagamento: formData.dataPagamento.toISOString().split('T')[0],
      })
      alert('✅ Modifiche salvate con successo!')
      setIsEditing(false)
      fetchPagamento() // Ricarica i dati del pagamento dopo la modifica
    } catch (error) {
      setError(error.response?.data?.message || 'Errore generico.')
    }
  }

  // Funzione per eliminare il pagamento
  const eliminaPagamento = async () => {
    if (window.confirm('Vuoi eliminare questo pagamento?')) {
      try {
        await apiClient.delete(`/api/pagamenti/${id}`)
        navigate('/pagamenti') // Reindirizza alla lista dei pagamenti dopo l'eliminazione
      } catch (error) {
        setError('Errore nella cancellazione del pagamento.', error)
      }
    }
  }

  // Mostra un messaggio di caricamento durante il fetch dei dati
  if (loading) return <p>Caricamento in corso...</p>

  // Mostra un messaggio di errore se si verifica un problema
  if (error) return <div className="alert alert-danger">{error}</div>

  // Mostra un messaggio se nessun pagamento è stato trovato
  if (!pagamento) return <p>⚠️ Nessun pagamento trovato.</p>

  return (
    <>
      <AdminNavbar />
      <div className="container mt-4">
        <h2 className="text-center mb-4">💰 Dettaglio Pagamento</h2>

        <Form onSubmit={handleSubmit}>
          {/* Campo Data Pagamento */}
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
              disabled={!isEditing}
              required
            />
          </Form.Group>

          {/* Campo Studente */}
          <Form.Group className="mb-3">
            <Form.Label>🎓 Studente</Form.Label>
            <Form.Select
              name="studenteId"
              value={formData.studenteId}
              onChange={handleChange}
              disabled={!isEditing}
              required
            >
              {studenti.map((studente) => (
                <option key={studente.id} value={studente.id}>
                  {studente.nome} {studente.cognome}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Campo Importo */}
          <Form.Group className="mb-3">
            <Form.Label>💰 Importo (€)</Form.Label>
            <Form.Control
              type="number"
              name="importo"
              value={formData.importo}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />
          </Form.Group>

          {/* Campo Mensilità */}
          <Form.Group className="mb-3">
            <Form.Label>📅 Mensilità</Form.Label>
            <Form.Control
              type="text"
              name="mensilitaSaldata"
              value={formData.mensilitaSaldata}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />
          </Form.Group>

          {/* Campo Metodo di Pagamento */}
          <Form.Group className="mb-3">
            <Form.Label>🏦 Metodo di Pagamento</Form.Label>
            <Form.Select
              name="metodoPagamento"
              value={formData.metodoPagamento}
              onChange={handleChange}
              disabled={!isEditing}
            >
              <option value="CARTA">Carta</option>
              <option value="BONIFICO">Bonifico</option>
            </Form.Select>
          </Form.Group>

          {/* Campo Numero Ricevuta */}
          <Form.Group className="mb-3">
            <Form.Label>📝 Numero Ricevuta</Form.Label>
            <Form.Control
              type="text"
              name="numeroRicevuta"
              value={formData.numeroRicevuta}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />
          </Form.Group>

          {/* Campo Note */}
          <Form.Group className="mb-3">
            <Form.Label>🗒 Note</Form.Label>
            <Form.Control
              as="textarea"
              name="note"
              value={formData.note}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </Form.Group>

          {/* Pulsanti di Azione */}
          <div className="d-flex justify-content-between">
            {!isEditing ? (
              <Button variant="primary" onClick={() => setIsEditing(true)}>
                ✏️ Modifica
              </Button>
            ) : (
              <>
                <Button type="submit" variant="success">
                  💾 Salva Modifiche
                </Button>
                <Button
                  variant="secondary"
                  className="ms-2"
                  onClick={() => setIsEditing(false)}
                >
                  ❌ Annulla
                </Button>
              </>
            )}

            <Button variant="danger" onClick={eliminaPagamento}>
              🗑 Elimina
            </Button>
          </div>
        </Form>
      </div>
    </>
  )
}

export default PagamentiDetail
