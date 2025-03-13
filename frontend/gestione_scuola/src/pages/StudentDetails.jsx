import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import apiClient from '../api/apiClient'
import AdminNavbar from '../components/AdminNavbar'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

const StudentDetail = () => {
  const { id } = useParams()
  const [studente, setStudente] = useState(null)
  const [pagamenti, setPagamenti] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [pagamentoSelezionato, setPagamentoSelezionato] = useState(null)

  // Stati per il form pagamento
  const [importoPagamento, setImportoPagamento] = useState('')
  const [mensilita, setMensilita] = useState('')
  const [metodoPagamento, setMetodoPagamento] = useState('CARTA')
  const [note, setNote] = useState('')

  useEffect(() => {
    fetchDatiStudente()
  }, [])

  const fetchDatiStudente = async () => {
    try {
      const [studenteRes, pagamentiRes] = await Promise.all([
        apiClient.get(`/studenti/${id}`),
        apiClient.get(`/studenti/${id}/pagamenti`),
      ])

      setStudente(studenteRes.data)
      setPagamenti(pagamentiRes.data)
    } catch (error) {
      console.error('Errore nel recupero dei dati dello studente', error)
      setError('Errore nel caricamento dei dati.')
    } finally {
      setLoading(false)
    }
  }

  const handleAggiungiPagamento = () => {
    setPagamentoSelezionato(null)
    setImportoPagamento('')
    setMensilita('')
    setMetodoPagamento('CARTA')
    setNote('')
    setIsEditing(false)
    setShowModal(true)
  }

  const handleModificaPagamento = (pagamento) => {
    setPagamentoSelezionato(pagamento)
    setImportoPagamento(pagamento.importo)
    setMensilita(pagamento.mensilitaSaldata)
    setMetodoPagamento(pagamento.metodoPagamento)
    setNote(pagamento.note || '')
    setIsEditing(true)
    setShowModal(true)
  }

  const handleEliminaPagamento = async (pagamentoId) => {
    if (window.confirm('Sei sicuro di voler eliminare questo pagamento?')) {
      try {
        await apiClient.delete(`/pagamenti/${pagamentoId}`)
        fetchDatiStudente()
      } catch (error) {
        console.error('Errore nell’eliminazione del pagamento', error)
        alert('Errore nell’eliminazione del pagamento.')
      }
    }
  }

  const handleSalvaPagamento = async () => {
    if (!importoPagamento || parseFloat(importoPagamento) <= 0) {
      alert('Inserisci un importo valido.')
      return
    }
    if (!mensilita) {
      alert('Seleziona la mensilità saldata.')
      return
    }

    try {
      if (isEditing && pagamentoSelezionato) {
        await apiClient.put(`/pagamenti/${pagamentoSelezionato.id}`, {
          importo: parseFloat(importoPagamento),
          mensilitaSaldata: mensilita,
          metodoPagamento: metodoPagamento,
          note: note,
        })
      } else {
        await apiClient.post(`/studenti/${id}/pagamenti`, {
          importo: parseFloat(importoPagamento),
          mensilitaSaldata: mensilita,
          metodoPagamento: metodoPagamento,
          note: note,
        })
      }

      setShowModal(false)
      fetchDatiStudente()
    } catch (error) {
      console.error('Errore nel salvataggio del pagamento', error)
      alert('Errore nel salvataggio del pagamento.')
    }
  }

  if (loading) return <p>Caricamento in corso...</p>
  if (error) return <div className="alert alert-danger">{error}</div>

  return (
    <>
      <AdminNavbar />
      <div className="container mt-4">
        <h2 className="text-center mb-4">🎓 Dettagli Studente</h2>

        {/* Informazioni Studente */}
        {studente && (
          <div className="card p-4 shadow">
            <h5>👤 Informazioni Studente</h5>
            <p>
              <strong>Nome:</strong> {studente.nome}
            </p>
            <p>
              <strong>Cognome:</strong> {studente.cognome}
            </p>
            <p>
              <strong>Età:</strong> {studente.eta}
            </p>
            <p>
              <strong>Lingua da imparare:</strong> {studente.linguaDaImparare}
            </p>
            <p>
              <strong>Livello:</strong> {studente.livello}
            </p>
            <p>
              <strong>Tipologia Iscrizione:</strong>{' '}
              {studente.tipologiaIscrizione}
            </p>
          </div>
        )}

        {/* Pagamenti */}
        <div className="mt-4">
          <h5>💰 Pagamenti</h5>
          {pagamenti.length === 0 ? (
            <p>Nessun pagamento registrato</p>
          ) : (
            <ul className="list-group">
              {pagamenti.map((pagamento) => (
                <li
                  key={pagamento.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <span>
                    📅 {pagamento.mensilitaSaldata} - 💵 €
                    {pagamento.importo.toFixed(2)} - 🏦{' '}
                    {pagamento.metodoPagamento}
                  </span>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleModificaPagamento(pagamento)}
                  >
                    ✏️ Modifica
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleEliminaPagamento(pagamento.id)}
                  >
                    🗑 Elimina
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button
            className="btn btn-success mt-3"
            onClick={handleAggiungiPagamento}
          >
            ➕ Aggiungi Pagamento
          </button>
        </div>
      </div>

      {/* 🔹 MODALE PER AGGIUNGERE O MODIFICARE UN PAGAMENTO */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? '✏️ Modifica Pagamento' : '➕ Aggiungi Pagamento'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="number"
            className="form-control mb-2"
            placeholder="Importo (€)"
            value={importoPagamento}
            onChange={(e) => setImportoPagamento(e.target.value)}
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Mensilità"
            value={mensilita}
            onChange={(e) => setMensilita(e.target.value)}
          />
          <select
            className="form-select mb-2"
            value={metodoPagamento}
            onChange={(e) => setMetodoPagamento(e.target.value)}
          >
            <option value="CARTA">Carta</option>
            <option value="CONTANTI">Contanti</option>
            <option value="BONIFICO">Bonifico</option>
          </select>
          <textarea
            className="form-control"
            placeholder="Note (opzionale)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Annulla
          </Button>
          <Button variant="success" onClick={handleSalvaPagamento}>
            {isEditing ? '💾 Salva Modifiche' : '➕ Aggiungi'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default StudentDetail
