import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import apiClient from '../api/apiClient'
import AdminNavbar from '../components/AdminNavbar'

const CourseDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [corso, setCorso] = useState(null)
  const [studentiDisponibili, setStudentiDisponibili] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    fetchCorso()
    fetchStudentiDisponibili()
  }, [])

 const fetchCorso = async () => {
   setLoading(true)
   try {
     const response = await apiClient.get(`/corsi/${id}`)
     const corsoData = response.data || {}
     console.log('Corso attivo:', corsoData.attivo) // Controlla se è true
     setCorso(corsoData)
   } catch (error) {
     console.error('❌ Errore nel recupero del corso:', error)
     setError('Errore nel caricamento del corso.')
   } finally {
     setLoading(false)
   }
 }


  const fetchStudentiDisponibili = async () => {
    try {
      const response = await apiClient.get('/studenti/senza-corso')
      setStudentiDisponibili(response.data || [])
    } catch (error) {
      console.error('❌ Errore nel recupero degli studenti disponibili:', error)
    }
  }

  const assegnaStudente = async (studenteId) => {
    try {
      await apiClient.post(`/corsi/${id}/aggiungi-studente`, { studenteId })
      setSuccessMessage('✅ Studente assegnato con successo!')
      fetchCorso()
      fetchStudentiDisponibili()
    } catch (error) {
      console.error('❌ Errore nell’assegnazione dello studente:', error)
      setError('Errore durante l’assegnazione dello studente.')
    }
  }
const toggleStatoCorso = async () => {
  console.log(
    'Stato attuale del corso:',
    corso?.attivo ? 'Attivo' : 'Non attivo'
  )
  const conferma = corso?.attivo
    ? 'Vuoi disattivare questo corso?'
    : 'Vuoi riattivare questo corso?'

  if (window.confirm(conferma)) {
    try {
      if (corso?.attivo) {
        console.log('Disattivazione in corso...')
        await apiClient.put(`/corsi/${id}/interrompi`)
      } else {
        console.log('Riattivazione in corso...')
        await apiClient.put(`/corsi/${id}/riattiva`)
      }
      console.log('Cambio stato completato. Ricarico il corso.')
      fetchCorso() // Ricarica i dati del corso
    } catch (error) {
      console.error('❌ Errore nel cambio di stato del corso:', error)
      setError('Errore durante il cambio di stato del corso.')
    }
  }
}


  const eliminaCorso = async () => {
    if (window.confirm('Vuoi eliminare definitivamente questo corso?')) {
      try {
        await apiClient.delete(`/corsi/${id}`)
        navigate('/corsi')
      } catch (error) {
        console.error('❌ Errore nell’eliminazione del corso:', error)
        setError('Errore durante l’eliminazione del corso.')
      }
    }
  }

  if (loading) return <p>⏳ Caricamento in corso...</p>
  if (error) return <div className="alert alert-danger">{error}</div>

  return (
    <>
      <AdminNavbar />
      <div className="container mt-4">
        <h2 className="text-center mb-4">📚 Dettagli Corso</h2>

        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        )}

        <div className="card shadow p-4">
          <h5>
            {corso?.lingua} - Livello <strong>{corso?.livello || 'N/A'}</strong>
          </h5>
          <p>
            <strong>🗓 Giorno:</strong> {corso?.giorno || 'N/A'}
          </p>
          <p>
            <strong>⏰ Orario:</strong> {corso?.orario || 'N/A'}
          </p>
          <p>
            <strong>🏫 Aula:</strong> {corso?.aula?.nome || 'Non assegnata'}
          </p>
          <p>
            <strong>👨‍🏫 Insegnante:</strong> {corso?.insegnante?.nome}{' '}
            {corso?.insegnante?.cognome}
          </p>

          <button
            className={`btn ${
              corso?.attivo ? 'btn-warning' : 'btn-success'
            } me-2`}
            onClick={toggleStatoCorso}
          >
            {corso?.attivo ? '🚫 Disattiva Corso' : '✅ Riattiva Corso'}
          </button>
          <button className="btn btn-danger" onClick={eliminaCorso}>
            🗑 Elimina Corso
          </button>
        </div>

        <div className="mt-4">
          <h5>🎓 Studenti Iscritti</h5>
          {corso?.studenti?.length === 0 ? (
            <p className="text-muted">Nessuno studente iscritto</p>
          ) : (
            <ul className="list-group">
              {corso?.studenti?.map((studente) => (
                <li key={studente.id} className="list-group-item">
                  {studente.nome} {studente.cognome}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-4">
          <h5>🎓 Studenti disponibili</h5>
          {studentiDisponibili.length === 0 ? (
            <p className="text-muted">Nessuno studente disponibile</p>
          ) : (
            <ul className="list-group">
              {studentiDisponibili.map((studente) => (
                <li
                  key={studente.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {studente.nome} {studente.cognome}
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => assegnaStudente(studente.id)}
                  >
                    ➕ Assegna
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  )
}

export default CourseDetails
