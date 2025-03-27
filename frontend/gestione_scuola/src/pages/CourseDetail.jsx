import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import apiClient from '../api/apiClient'
import AdminNavbar from '../components/AdminNavbar'
import ModaleCorso from '../components/ModaleCorso'
import OverlaySpinner from '../components/OverlaySpinner'


const CourseDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [corso, setCorso] = useState(null)
  const [studentiDisponibili, setStudentiDisponibili] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [showModale, setShowModale] = useState(false)

  useEffect(() => {
    fetchCorso()
    fetchStudentiDisponibili()
  }, [])

  const fetchCorso = async () => {
    setLoading(true)
    try {
      const response = await apiClient.get(`/corsi/${id}`)
      setCorso(response.data || {})
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
    const conferma = corso?.attivo
      ? 'Vuoi disattivare questo corso?'
      : 'Vuoi riattivare questo corso?'

    if (window.confirm(conferma)) {
      try {
        if (corso?.attivo) {
          await apiClient.put(`/corsi/${id}/interrompi`)
        } else {
          await apiClient.put(`/corsi/${id}/riattiva`)
        }
        fetchCorso()
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

  if (loading) return <OverlaySpinner />
  if (error) return <div className="alert alert-danger">{error}</div>

  return (
    <>
      <AdminNavbar />
      <div className="container pt-5 mt-5 mb-5">
        <h2 className="text-center mb-4">📚 Dettagli Corso</h2>

        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        )}

        <div className="card shadow p-4 border-0 rounded-4 bg-light-subtle">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">
              {corso?.lingua} - Livello{' '}
              <strong>{corso?.livello || 'N/A'}</strong>
            </h5>
            <span
              className={`badge ${
                corso?.attivo ? 'bg-success' : 'bg-secondary'
              }`}
            >
              {corso?.attivo ? 'Attivo' : 'Disattivato'}
            </span>
          </div>

          <p>
            <strong>🗓 Giorno:</strong> {corso?.giorno || 'N/A'}
          </p>
          <p>
            <strong>⏰ Orario:</strong> {corso?.orario || 'N/A'}
          </p>
          {corso?.secondoGiorno && (
            <p>
              <strong>🗓 Secondo Giorno:</strong> {corso.secondoGiorno}
            </p>
          )}
          {corso?.secondoOrario && (
            <p>
              <strong>⏰ Secondo Orario:</strong> {corso.secondoOrario}
            </p>
          )}
          <p>
            <strong>🏫 Aula:</strong> {corso?.aula?.nome || 'Non assegnata'}
          </p>
          <p>
            <strong>👨‍🏫 Insegnante:</strong> {corso?.insegnante?.nome}{' '}
            {corso?.insegnante?.cognome}
          </p>

          <div className="d-flex flex-wrap gap-2 mt-3">
            <button
              className={`btn ${corso?.attivo ? 'btn-warning' : 'btn-success'}`}
              onClick={toggleStatoCorso}
            >
              {corso?.attivo ? '🚫 Disattiva Corso' : '✅ Riattiva Corso'}
            </button>
            <button className="btn btn-danger" onClick={eliminaCorso}>
              🗑 Elimina Corso
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setShowModale(true)}
            >
              ✏️ Modifica
            </button>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-md-6">
            <h5>🎓 Studenti Iscritti</h5>
            {corso?.studenti?.length === 0 ? (
              <p className="text-muted">Nessuno studente iscritto</p>
            ) : (
              <ul className="list-group shadow-sm rounded-3">
                {corso?.studenti?.map((studente) => (
                  <li
                    key={studente.id}
                    className="list-group-item d-flex align-items-center"
                  >
                    {studente.nome} {studente.cognome}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="col-md-6 mt-4 mt-md-0">
            <h5>🎓 Studenti Disponibili</h5>
            {studentiDisponibili.length === 0 ? (
              <p className="text-muted">Nessuno studente disponibile</p>
            ) : (
              <ul className="list-group shadow-sm rounded-3">
                {studentiDisponibili.map((studente) => (
                  <li
                    key={studente.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {studente.nome} {studente.cognome}
                    <button
                      className="btn btn-outline-success btn-sm"
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

        <ModaleCorso
          show={showModale}
          onHide={() => setShowModale(false)}
          corso={corso}
          refresh={fetchCorso}
        />
      </div>
    </>
  )
}

export default CourseDetails
