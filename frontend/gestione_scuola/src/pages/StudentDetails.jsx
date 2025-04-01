import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../redux/slices/authSlice'
import apiClient from '../api/apiClient'
import AdminNavbar from '../components/AdminNavbar'
import 'react-datepicker/dist/react-datepicker.css'
import { registerLocale } from 'react-datepicker'
import it from 'date-fns/locale/it'
import ModalePagamento from '../components/ModalePagamento'
import ModaleStudente from '../components/ModaleStudente'
import FullscreenSpinner from '../components/FullScreenSpinner'
import OverlaySpinner from '../components/OverlaySpinner'



registerLocale('it', it)

const LIVELLI = [
  'STARTERS',
  'KIDS_BOX1',
  'KIDS_BOX2',
  'KIDS_BOX3',
  'KET_CAMBRIDGE',
  'PET_CAMBRIDGE',
  'FIRST_CAMBRIDGE',
  'ADVANCED_CAMBRIDGE',
  'A2_ADULTI',
  'B1_ADULTI',
  'B2_ADULTI',
  'C1_ADULTI',
  'C2_ADULTI',
]

const StudentDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)

  const [studente, setStudente] = useState(null)
  const [pagamenti, setPagamenti] = useState([])
  const [insegnanti, setInsegnanti] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [pagamentoSelezionato, setPagamentoSelezionato] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [salvataggioStudenteLoading, setSalvataggioStudenteLoading] = useState(false)
  const [salvataggioPagamentoLoading, setSalvataggioPagamentoLoading] = useState(false)

  const [formStudente, setFormStudente] = useState({
    nome: '',
    cognome: '',
    eta: '',
    linguaDaImparare: '',
    livello: 'STARTERS',
    tipologiaIscrizione: '',
    giorniPreferiti: [],
    fasceOrariePreferite: [],
    corsoPrivato: false,
    frequenzaCorsoPrivato: 1,
    tipoCorsoGruppo: '1 volta a settimana',
    insegnanteId: '',
  })

  useEffect(() => {
    fetchDatiStudente()
    fetchInsegnanti()
  }, [])

const fetchDatiStudente = async () => {
  setLoading(true)
  try {
    const [studenteRes, pagamentiRes] = await Promise.all([
      apiClient.get(`/studenti/${id}`),
      apiClient.get(`/pagamenti/studente/${id}`),
    ])

    console.log('📌 Studente ricevuto dal backend:', studenteRes.data) // 🔥 Debug
    setStudente(studenteRes.data)
    setPagamenti(pagamentiRes.data)
    setError(null)
  } catch (error) {
    console.error('❌ Errore nel recupero dei dati dello studente:', error)
    setError('Errore nel recupero dei dati dello studente.')
  } finally {
    setLoading(false)
  }
}


  const fetchInsegnanti = async () => {
    try {
      const response = await apiClient.get('/insegnanti')
      setInsegnanti(response.data)
      setError(null)
    } catch (error) {
      console.error('❌ Errore nel recupero degli insegnanti:', error)
      setError('Errore nel recupero degli insegnanti.')
    }
  }

 const handleSalvaModificheStudente = async (e) => {
  e.preventDefault()
  if (!token) {
    alert('⚠️ Token mancante, non puoi salvare le modifiche!')
    return
  }
  
  setSalvataggioStudenteLoading(true)

  try {
      await apiClient.put(`/studenti/${id}`, formStudente, {
      headers: { Authorization: `Bearer ${token}` },
    })

    alert('✅ Studente modificato correttamente!')
    setShowEditModal(false)
    fetchDatiStudente()
  } catch (error) {
    console.error('❌ Errore nel salvataggio dello studente:', error)

    if (error.response?.status === 401) {
      alert('⚠️ Sessione scaduta. Effettua nuovamente il login.')
      dispatch(logout())
      window.location.href = '/login'
    } else {
      alert(
        `Errore: ${error.response?.data?.message || 'Errore sconosciuto.'}`
      )
    }
  } finally {
    setSalvataggioStudenteLoading(false)
  }
}

const handleChangeStudente = () => {
  if (!studente) {
    alert('❌ Errore: nessuno studente selezionato.')
    return
  }

  console.log('📌 Precarico i dati dello studente nel form:', studente)

  setFormStudente({
    nome: studente.nome || '',
    cognome: studente.cognome || '',
    eta: studente.eta || '',
    linguaDaImparare: studente.linguaDaImparare || '',
    livello: LIVELLI.includes(studente.livello) ? studente.livello : 'BASE',
    tipologiaIscrizione: studente.tipologiaIscrizione || '',
    giorniPreferiti: studente.giorniPreferiti || [],
    fasceOrariePreferite: studente.fasceOrariePreferite || [],
    corsoPrivato: studente.corsoPrivato || false,
    frequenzaCorsoPrivato: studente.frequenzaCorsoPrivato || 1,
    tipoCorsoGruppo: studente.tipoCorsoGruppo || '1 volta a settimana',
    insegnanteId: studente.insegnanteId
      ? String(studente.insegnanteId)
      : studente.insegnante
      ? String(studente.insegnante.id)
      : '', 
  })

  setShowEditModal(true)
}


  const handleAggiungiPagamento = () => {
    setPagamentoSelezionato({
      studenteId: id,
      dataPagamento: new Date(),
      importo: '',
      mensilitaSaldata: '',
      metodoPagamento: 'CARTA',
      numeroRicevuta: '',
      note: '',
    })
    setIsEditing(false)
    setShowModal(true)
  }

  const handleModificaPagamento = (pagamento) => {
    setPagamentoSelezionato({
      ...pagamento,
      dataPagamento: pagamento.dataPagamento
        ? new Date(pagamento.dataPagamento)
        : new Date(),
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
        console.error('❌ Errore nell’eliminazione del pagamento:', error)
        alert('Errore nell’eliminazione del pagamento.')
      }
    }
  }

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()

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
      studente: { id: id },
      dataPagamento: dataPagamento
        ? new Date(dataPagamento).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      importo: Math.max(1, parseFloat(importo)),
      mensilitaSaldata,
      numeroRicevuta: numeroRicevuta || `REC-${Date.now()}`,
      metodoPagamento,
      note: note || '',
    }

    setSalvataggioPagamentoLoading(true)

    try {
      if (isEditing) {
        await apiClient.put(
          `/pagamenti/${pagamentoSelezionato.id}`,
          pagamentoData
        )
      } else {
        await apiClient.post(`/studenti/${id}/pagamenti`, pagamentoData)
      }

      alert('✅ Pagamento salvato con successo!')
      setShowModal(false)
      fetchDatiStudente()
    } catch (error) {
      console.error('❌ Errore nel salvataggio del pagamento:', error)

      if (error.response?.status === 401) {
        alert('⚠️ Sessione scaduta. Effettua nuovamente il login.')
        dispatch(logout())
        window.location.href = '/login'
      } else {
        alert(
          `Errore: ${error.response?.data?.message || 'Errore sconosciuto.'}`
        )
      } 
    } finally {
      setSalvataggioPagamentoLoading(false)
    }
  }

  if (loading) return <FullscreenSpinner message="Caricamento studente..." />
  if (error) return <div className="alert alert-danger">{error}</div>

  return (
    <>
      <AdminNavbar />
      <div className="container pt-5 mt-5">
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
              <strong>Livello:</strong> {studente.livello || 'BASE'}
            </p>
            <p>
              <strong>Tipologia Iscrizione:</strong>{' '}
              {studente.tipologiaIscrizione}
            </p>
            <p>
              <strong>Giorni Preferiti:</strong>{' '}
              {studente.giorniPreferiti?.join(', ') ||
                'Nessun giorno selezionato'}
            </p>
            <p>
              <strong>Fasce Orarie Preferite:</strong>{' '}
              {studente.fasceOrariePreferite?.join(', ') ||
                'Nessuna fascia selezionata'}
            </p>
            <p>
              <strong>Tipo di Corso:</strong>{' '}
              {studente.corsoPrivato ? 'Privato' : 'Gruppo'}
            </p>
            {studente.corsoPrivato && (
              <p>
                <strong>Frequenza Corso Privato:</strong>{' '}
                {studente.frequenzaCorsoPrivato} ore
              </p>
            )}
            {!studente.corsoPrivato && (
              <p>
                <strong>Tipo Corso Gruppo:</strong> {studente.tipoCorsoGruppo}
              </p>
            )}
            <p>
              <strong>Insegnante:</strong>{' '}
              {studente.insegnanteNome && studente.insegnanteCognome
                ? `${studente.insegnanteNome} ${studente.insegnanteCognome}`
                : studente.insegnanteId
                ? `ID: ${studente.insegnanteId} (dettagli non disponibili)`
                : 'Nessun insegnante assegnato'}
            </p>

            <button
              className="btn btn-warning mt-2"
              onClick={handleChangeStudente}
            >
              ✏️ Modifica Studente
            </button>
          </div>
        )}

        <div className="mt-4 position-relative">
          {salvataggioPagamentoLoading && (
            <OverlaySpinner message="Salvataggio pagamento..." />
          )}
          <h5>💳 Pagamenti</h5>
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
                    {pagamento.importo ? pagamento.importo.toFixed(2) : '0.00'}{' '}
                    - 🏦 {pagamento.metodoPagamento}
                  </span>
                  <div>
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
                  </div>
                </li>
              ))}
            </ul>
          )}
          <button
            className="btn btn-success mt-3 mb-4"
            onClick={handleAggiungiPagamento}
          >
            ➕ Aggiungi Pagamento
          </button>
        </div>
      </div>
      {/* Modale Pagamento */}
      <ModalePagamento
        show={showModal}
        onHide={() => setShowModal(false)}
        pagamentoSelezionato={pagamentoSelezionato}
        setPagamentoSelezionato={setPagamentoSelezionato}
        isEditing={isEditing}
        handleSubmit={handleSubmit}
        disableStudentSelect={true}
      />

      {/* Modale Studente */}
      <div className="position-relative">
        {salvataggioStudenteLoading && (
          <OverlaySpinner message="Salvataggio studente..." />
        )}
        <ModaleStudente
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          formStudente={formStudente}
          setFormStudente={setFormStudente}
          handleSalvaModificheStudente={handleSalvaModificheStudente}
          insegnanti={insegnanti}
          loading={salvataggioStudenteLoading}
        />
      </div>
    </>
  )
}

export default StudentDetail
