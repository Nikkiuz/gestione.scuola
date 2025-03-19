import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import apiClient from '../api/apiClient'
import AdminNavbar from '../components/AdminNavbar'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { registerLocale } from 'react-datepicker'
import it from 'date-fns/locale/it'

registerLocale('it', it)

const StudentDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [studente, setStudente] = useState(null)
  const [pagamenti, setPagamenti] = useState([])
  const [insegnanti, setInsegnanti] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [pagamentoSelezionato, setPagamentoSelezionato] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)

  const [formStudente, setFormStudente] = useState({
    nome: '',
    cognome: '',
    eta: '',
    linguaDaImparare: '',
    livello: '',
    tipologiaIscrizione: '',
    giorniPreferiti: [],
    fasceOrariePreferite: [],
    corsoPrivato: false,
    frequenzaCorsoPrivato: 1,
    tipoCorsoGruppo: '1 volta a settimana',
    insegnanteId: '',
  })

  useEffect(() => {
    console.log('📌 StudentDetail si è montato o aggiornato!')
    fetchDatiStudente()
    fetchInsegnanti()
    console.log('📌 La pagina è stata caricata di nuovo!')
  }, [])

const fetchDatiStudente = async () => {
  try {
    const [studenteRes, pagamentiRes] = await Promise.all([
      apiClient.get(`/studenti/${id}`),
      apiClient.get(`/studenti/${id}/pagamenti`),
    ])
    setStudente((prev) => prev || studenteRes.data)
    setPagamenti(pagamentiRes.data)
    setError(null) // Reset error
  } catch (error) {
    console.error('Errore nel recupero dei dati dello studente', error)
    setError('Errore nel recupero dei dati dello studente') // Aggiungi messaggio di errore
  } finally {
    setLoading(false)
  }
}

const fetchInsegnanti = async () => {
  try {
    const response = await apiClient.get('/insegnanti')
    setInsegnanti(response.data)
    setError(null) // Reset error
  } catch (error) {
    console.error('Errore nel recupero degli insegnanti', error)
    setError('Errore nel recupero degli insegnanti') // Aggiungi messaggio di errore
  }
}

const handleSalvaModificheStudente = async () => {
  console.log('📤 Tentativo di salvare le modifiche...')
  console.log('📌 Token PRIMA della richiesta:', localStorage.getItem('token'))

  // Verifica che il token sia ancora presente prima della richiesta
  if (!localStorage.getItem('token')) {
    console.warn('❌ Token non trovato prima della richiesta!')
    alert('⚠️ Token mancante, non puoi salvare le modifiche!')
    return
  }

  try {
    const response = await apiClient.put(`/studenti/${id}`, formStudente)

    console.log('✅ Studente modificato con successo:', response.data)
    alert('✅ Studente modificato correttamente!')
    setShowEditModal(false)
    fetchDatiStudente()

    console.log('📌 Token DOPO la richiesta:', localStorage.getItem('token'))
  } catch (error) {
    console.error('❌ Errore nel salvataggio dello studente:', error)

    if (error.response) {
      console.log('📌 Stato della risposta:', error.response.status)
      console.log('📌 Corpo della risposta:', error.response.data)

      if (error.response.status === 401) {
        alert('⚠️ Sessione scaduta. Effettua nuovamente il login.')
        console.log(
          '📌 Rimuovendo il token dal localStorage',
          localStorage.getItem('token')
        )
        localStorage.removeItem('token') // ✅ Solo in caso di errore 401
        console.warn("📌 Token RIMOSSO dopo l'errore 401")
        window.location.href = '/login' // ✅ Reindirizziamo alla login
      } else {
        // Se l'errore non è 401, mostriamo l'errore generico
        alert(
          `Errore: ${error.response.data?.message || 'Errore sconosciuto.'}`
        )
        console.error("📌 Dettagli dell'errore:", error.response.data)
      }
    } else {
      alert('Errore nel salvataggio dello studente.')
      console.error("❌ Dettagli dell'errore:", error)
    }
  }
}


   const handleChangeStudente = () => {
     if (!studente) {
       alert('❌ Errore: nessuno studente selezionato.')
       return
     }

     setFormStudente({
       nome: studente.nome || '',
       cognome: studente.cognome || '',
       eta: studente.eta || '',
       linguaDaImparare: studente.linguaDaImparare || '',
       livello: studente.livello || '',
       tipologiaIscrizione: studente.tipologiaIscrizione || '',
       giorniPreferiti: studente.giorniPreferiti || [],
       fasceOrariePreferite: studente.fasceOrariePreferite || [],
       corsoPrivato: studente.corsoPrivato || false,
       frequenzaCorsoPrivato: studente.frequenzaCorsoPrivato || 1,
       tipoCorsoGruppo: studente.tipoCorsoGruppo || '1 volta a settimana',
       insegnanteId: studente.insegnante ? studente.insegnante.id : '',
     })

     setShowEditModal(true)
   }

  const handleAggiungiPagamento = () => {
    setPagamentoSelezionato({
      dataPagamento: new Date(),
      importo: '',
      mensilitaSaldata: '',
      metodoPagamento: 'CARTA',
      note: '',
    })
    setIsEditing(false)
    setShowModal(true)
  }

const handleModificaPagamento = (pagamento) => {
  console.log('📌 handleModificaPagamento CHIAMATO!', pagamento)
  setPagamentoSelezionato({
    ...pagamento,
    dataPagamento: new Date(pagamento.dataPagamento),
  })
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

const handleSubmit = async (e) => {
  if (e) e.preventDefault() // ✅ Evitiamo il comportamento predefinito

  console.log('📤 Tentativo di aggiungere un pagamento...')
  console.log('📌 Token PRIMA della richiesta:', localStorage.getItem('token'))

  if (!pagamentoSelezionato) {
    alert('❌ Errore: nessun pagamento selezionato.')
    return
  }

  const {
    dataPagamento,
    importo,
    mensilitaSaldata,
    metodoPagamento,
    numeroRicevuta,
    note,
  } = pagamentoSelezionato

  if (!importo || parseFloat(importo) <= 0) {
    alert('❌ Inserisci un importo valido.')
    return
  }
  if (!mensilitaSaldata) {
    alert('❌ Seleziona la mensilità saldata.')
    return
  }
  if (!numeroRicevuta) {
    alert('❌ Inserisci un numero ricevuta valido.')
    return
  }

  const pagamentoData = {
    studente: {
      id: id || pagamentoSelezionato.studente?.id, // ✅ Usa l'ID dello studente se presente
    },
    dataPagamento: dataPagamento
      ? new Date(dataPagamento).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0], // ✅ Formato YYYY-MM-DD
    importo: Math.max(1, parseFloat(importo)), // ✅ Evita importo = 0
    mensilitaSaldata,
    numeroRicevuta: numeroRicevuta || `REC-${Date.now()}`,
    metodoPagamento,
    note: note || '',
  }

  console.log('📌 Dati inviati:', JSON.stringify(pagamentoData, null, 2))

  try {
    let response
    if (isEditing) {
      response = await apiClient.put(
        `/pagamenti/${pagamentoSelezionato.id}`,
        pagamentoData
      )
      console.log('✅ Pagamento modificato:', response.data)
    } else {
      response = await apiClient.post(
        `/studenti/${id}/pagamenti`,
        pagamentoData
      )
      console.log('✅ Pagamento aggiunto:', response.data)
    }

    alert('✅ Pagamento aggiunto correttamente!')
    setShowModal(false)
    fetchDatiStudente()

    console.log('📌 Token DOPO la richiesta:', localStorage.getItem('token'))
  } catch (error) {
    console.error('❌ Errore nel salvataggio del pagamento:', error)

    if (error.response) {
      console.log('📌 Stato della risposta:', error.response.status)
      console.log('📌 Corpo della risposta:', error.response.data)

      if (error.response.status === 401) {
        alert('⚠️ Sessione scaduta. Effettua nuovamente il login.')
        localStorage.removeItem('token') // ✅ Se è un 401, rimuoviamo il token
        window.location.href = '/login' // ✅ Reindirizziamo alla login
      } else {
        alert(
          `Errore: ${error.response.data?.message || 'Errore sconosciuto.'}`
        )
      }
    } else {
      alert('Errore nel salvataggio del pagamento.')
    }
  }
}

  if (loading) return <p>Caricamento in corso...</p>
  if (error) return <div className="alert alert-danger">{error}</div>

  return (
    <>
      <AdminNavbar />
      <div className="container mt-4">
        <h2 className="text-center mb-4">🎓 Dettagli Studente</h2>
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/studenti')}
        >
          🔙 Torna alla Lista Studenti
        </button>

        {studente && (
          <div className="card p-4 shadow mt-3">
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
            <button
              className="btn btn-warning mt-2"
              onClick={handleChangeStudente}
            >
              ✏️ Modifica Studente
            </button>
          </div>
        )}

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
          <Form onSubmit={(e) => handleSubmit(e)}>
            {' '}
            {/* ✅ Aggiunto preventDefault */}
            {/* 📆 Mensilità Saldata */}
            <Form.Group className="mb-3">
              <Form.Label>✅ Mensilità Saldata</Form.Label>
              <Form.Select
                name="mensilitaSaldata"
                value={pagamentoSelezionato?.mensilitaSaldata || ''}
                onChange={(e) =>
                  setPagamentoSelezionato({
                    ...pagamentoSelezionato,
                    mensilitaSaldata: e.target.value,
                  })
                }
                required
              >
                <option value="">Seleziona Mensilità</option>
                {Array.from({ length: 12 }, (_, i) => {
                  const mese = new Date(0, i).toLocaleString('it', {
                    month: 'long',
                  })
                  return (
                    <option
                      key={mese}
                      value={`${mese} ${new Date().getFullYear()}`}
                    >
                      {mese} {new Date().getFullYear()}
                    </option>
                  )
                })}
              </Form.Select>
            </Form.Group>
            {/* 📆 Data Pagamento */}
            <Form.Group className="mb-3">
              <Form.Label>📆 Data Pagamento</Form.Label>
              <DatePicker
                selected={pagamentoSelezionato?.dataPagamento ?? new Date()} // ✅ Evita errori con `null`
                onChange={(date) =>
                  setPagamentoSelezionato({
                    ...pagamentoSelezionato,
                    dataPagamento: date,
                  })
                }
                dateFormat="yyyy-MM-dd"
                locale="it"
                className="form-control ms-2 text-center"
                required
              />
            </Form.Group>
            {/* 💰 Importo */}
            <Form.Group className="mb-3">
              <Form.Label>💰 Importo (€)</Form.Label>
              <Form.Control
                type="number"
                name="importo"
                value={pagamentoSelezionato?.importo || ''}
                onChange={(e) =>
                  setPagamentoSelezionato({
                    ...pagamentoSelezionato,
                    importo: e.target.value,
                  })
                }
                min="0.01"
                step="0.01"
                required
              />
            </Form.Group>
            {/* 💳 Metodo di Pagamento */}
            <Form.Group className="mb-3">
              <Form.Label>💳 Metodo di Pagamento</Form.Label>
              <Form.Select
                name="metodoPagamento"
                value={pagamentoSelezionato?.metodoPagamento || 'CARTA'}
                onChange={(e) =>
                  setPagamentoSelezionato({
                    ...pagamentoSelezionato,
                    metodoPagamento: e.target.value,
                  })
                }
                required
              >
                <option value="CARTA">Carta</option>
                <option value="BONIFICO">Bonifico</option>
              </Form.Select>
            </Form.Group>
            {/* 🧾 Numero Ricevuta */}
            <Form.Group className="mb-3">
              <Form.Label>🧾 Numero Ricevuta</Form.Label>
              <Form.Control
                type="text"
                name="numeroRicevuta"
                value={pagamentoSelezionato?.numeroRicevuta || ''}
                onChange={(e) =>
                  setPagamentoSelezionato({
                    ...pagamentoSelezionato,
                    numeroRicevuta: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
            {/* 📝 Note */}
            <Form.Group className="mb-3">
              <Form.Label>📝 Note</Form.Label>
              <Form.Control
                as="textarea"
                name="note"
                value={pagamentoSelezionato?.note || ''}
                onChange={(e) =>
                  setPagamentoSelezionato({
                    ...pagamentoSelezionato,
                    note: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Button type="submit" variant="success">
              {isEditing ? '💾 Salva Modifiche' : '✅ Aggiungi Pagamento'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* 🔹 MODALE PER MODIFICARE STUDENTE */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>✏️ Modifica Studente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => handleSalvaModificheStudente(e)}>
            {' '}
            {/* ✅ Aggiunto onSubmit */}
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                name="nome"
                value={formStudente.nome}
                onChange={handleChangeStudente}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cognome</Form.Label>
              <Form.Control
                type="text"
                name="cognome"
                value={formStudente.cognome}
                onChange={handleChangeStudente}
                required
              />
            </Form.Group>
            {/* Età */}
            <Form.Group className="mb-3">
              <Form.Label>Età</Form.Label>
              <Form.Control
                type="number"
                name="eta"
                value={formStudente.eta}
                onChange={handleChangeStudente}
                required
              />
            </Form.Group>
            {/* Lingua da imparare */}
            <Form.Group className="mb-3">
              <Form.Label>Lingua da imparare</Form.Label>
              <Form.Control
                type="text"
                name="linguaDaImparare"
                value={formStudente.linguaDaImparare}
                onChange={handleChangeStudente}
                required
              />
            </Form.Group>
            {/* Livello iniziale */}
            <Form.Group className="mb-3">
              <Form.Label>Livello Iniziale</Form.Label>
              <Form.Control
                type="text"
                name="livello"
                value={formStudente.livello}
                onChange={handleChangeStudente}
                placeholder="Lascia vuoto se non disponibile"
              />
            </Form.Group>
            {/* Tipologia di iscrizione */}
            <Form.Group className="mb-3">
              <Form.Label>Tipologia di Iscrizione</Form.Label>
              <Form.Control
                type="text"
                name="tipologiaIscrizione"
                value={formStudente.tipologiaIscrizione}
                onChange={handleChangeStudente}
                required
              />
            </Form.Group>
            {/* Giorni Preferiti */}
            <Form.Group className="mb-3">
              <Form.Label>Giorni Preferiti</Form.Label>
              <div className="d-flex flex-wrap">
                {['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì'].map(
                  (giorno) => (
                    <Form.Check
                      key={giorno}
                      type="checkbox"
                      label={giorno}
                      value={giorno}
                      checked={formStudente.giorniPreferiti.includes(giorno)}
                      onChange={(e) => {
                        const { value, checked } = e.target
                        setFormStudente((prev) => ({
                          ...prev,
                          giorniPreferiti: checked
                            ? [...prev.giorniPreferiti, value]
                            : prev.giorniPreferiti.filter((g) => g !== value),
                        }))
                      }}
                      className="me-3"
                    />
                  )
                )}
              </div>
            </Form.Group>
            {/* Fasce Orarie Preferite */}
            <Form.Group className="mb-3">
              <Form.Label>Fasce Orarie Preferite</Form.Label>
              <div className="d-flex flex-wrap">
                {[
                  '08:00-10:00',
                  '10:00-12:00',
                  '12:00-14:00',
                  '14:00-16:00',
                  '16:00-18:00',
                  '18:00-20:00',
                ].map((fascia) => (
                  <Form.Check
                    key={fascia}
                    type="checkbox"
                    label={fascia}
                    value={fascia}
                    checked={formStudente.fasceOrariePreferite.includes(fascia)}
                    onChange={(e) => {
                      const { value, checked } = e.target
                      setFormStudente((prev) => ({
                        ...prev,
                        fasceOrariePreferite: checked
                          ? [...prev.fasceOrariePreferite, value]
                          : prev.fasceOrariePreferite.filter(
                              (f) => f !== value
                            ),
                      }))
                    }}
                    className="me-3"
                  />
                ))}
              </div>
            </Form.Group>
            {/* Corso Privato */}
            <Form.Group className="mb-3">
              <Form.Label>Corso Privato</Form.Label>
              <Form.Check
                type="checkbox"
                name="corsoPrivato"
                checked={formStudente.corsoPrivato}
                onChange={(e) =>
                  setFormStudente((prev) => ({
                    ...prev,
                    corsoPrivato: e.target.checked,
                  }))
                }
              />
            </Form.Group>
            {formStudente.corsoPrivato && (
              <Form.Group className="mb-3">
                <Form.Label>Ore Settimanali</Form.Label>
                <Form.Control
                  type="number"
                  name="frequenzaCorsoPrivato"
                  value={formStudente.frequenzaCorsoPrivato}
                  onChange={handleChangeStudente}
                  min="1"
                  required
                />
              </Form.Group>
            )}
            {/* Tipo di Corso di Gruppo */}
            <Form.Group className="mb-3">
              <Form.Label>Tipo di Corso di Gruppo</Form.Label>
              <Form.Select
                name="tipoCorsoGruppo"
                value={formStudente.tipoCorsoGruppo}
                onChange={handleChangeStudente}
              >
                <option value="1 volta a settimana">1 volta a settimana</option>
                <option value="2 volte a settimana">2 volte a settimana</option>
              </Form.Select>
            </Form.Group>
            {/* Insegnante Preferito */}
            <Form.Group className="mb-3">
              <Form.Label>Insegnante Preferito</Form.Label>
              <Form.Select
                name="insegnanteId"
                value={formStudente.insegnanteId}
                onChange={handleChangeStudente}
              >
                <option value="">Nessuna preferenza</option>
                {insegnanti.map((insegnante) => (
                  <option key={insegnante.id} value={insegnante.id}>
                    {insegnante.nome} {insegnante.cognome}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Button type="submit" variant="success">
              💾 Salva Modifiche
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default StudentDetail
