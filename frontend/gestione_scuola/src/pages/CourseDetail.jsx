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
    try {
      const response = await apiClient.get(`/corsi/${id}`)
      setCorso(response.data)
    } catch (error) {
      console.error('Errore nel recupero del corso', error)
      setError('Errore nel caricamento del corso.')
    } finally {
      setLoading(false)
    }
  }

  const fetchStudentiDisponibili = async () => {
    try {
      const response = await apiClient.get('/studenti/senza-corso')
      setStudentiDisponibili(response.data)
    } catch (error) {
      console.error('Errore nel recupero degli studenti disponibili', error)
    }
  }

  const assegnaStudente = async (studenteId) => {
    try {
      await apiClient.post(`/corsi/${corso.id}/aggiungi-studente`, {
        studenteId,
      })
      setSuccessMessage('Studente assegnato con successo!')
      fetchCorso()
      fetchStudentiDisponibili()
    } catch (error) {
      console.error('Errore nell’assegnare lo studente', error)
      setError('Errore nell’assegnazione dello studente.')
    }
  }

  const disattivaCorso = async () => {
    if (window.confirm('Vuoi disattivare questo corso?')) {
      try {
        await apiClient.put(`/corsi/${id}/disattiva`)
        fetchCorso()
      } catch (error) {
        console.error('Errore nella disattivazione del corso', error)
      }
    }
  }

  const eliminaCorso = async () => {
    if (window.confirm('Vuoi eliminare definitivamente questo corso?')) {
      try {
        await apiClient.delete(`/corsi/${id}`)
        navigate('/corsi')
      } catch (error) {
        console.error('Errore nell’eliminazione del corso', error)
      }
    }
  }

  if (loading) return <p>Caricamento in corso...</p>
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
            {corso.lingua} - Livello {corso.livello}
          </h5>
          <p>
            <strong>🗓 Giorno:</strong> {corso.giorno}
          </p>
          <p>
            <strong>⏰ Orario:</strong> {corso.orario}
          </p>
          <p>
            <strong>🏫 Aula:</strong> {corso.aula?.nome || 'Non assegnata'}
          </p>
          <p>
            <strong>👨‍🏫 Insegnante:</strong> {corso.insegnante?.nome}{' '}
            {corso.insegnante?.cognome}
          </p>

          <button
            className={`btn ${
              corso.attivo ? 'btn-warning' : 'btn-success'
            } me-2`}
            onClick={disattivaCorso}
          >
            {corso.attivo ? '🚫 Disattiva Corso' : '✅ Riattiva Corso'}
          </button>
          <button className="btn btn-danger" onClick={eliminaCorso}>
            🗑 Elimina Corso
          </button>
        </div>

        <div className="mt-4">
          <h5>🎓 Studenti Iscritti</h5>
          {corso.studenti.length === 0 ? (
            <p>Nessuno studente iscritto</p>
          ) : (
            <ul className="list-group">
              {corso.studenti.map((studente) => (
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
            <p>Nessun studente disponibile</p>
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
