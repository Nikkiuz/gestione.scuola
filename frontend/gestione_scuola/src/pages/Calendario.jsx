import { useEffect, useState } from 'react'
import apiClient from '../api/apiClient'
import moment from 'moment'
import 'moment/locale/it'
import AdminNavbar from '../components/AdminNavbar'

const Calendario = () => {
  const [settimana, setSettimana] = useState(moment()) // Settimana corrente
  const [corsi, setCorsi] = useState([])
  const [insegnanti, setInsegnanti] = useState([])
  const [livelli, setLivelli] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [filtroInsegnante, setFiltroInsegnante] = useState('')
  const [filtroLivello, setFiltroLivello] = useState('')

  useEffect(() => {
    fetchCorsi()
    fetchInsegnanti()
    fetchLivelli()
  }, [settimana, filtroInsegnante, filtroLivello])

  const fetchCorsi = async () => {
    setLoading(true)
    try {
      const response = await apiClient.get(`/calendario/corsi-programmati`, {
        params: {
          giorno: settimana.startOf('isoWeek').format('YYYY-MM-DD'),
          insegnante: filtroInsegnante,
          livello: filtroLivello,
        },
      })
      setCorsi(response.data || [])
    } catch (error) {
      console.error('❌ Errore nel recupero del calendario:', error)
      setError('⚠️ Nessun corso disponibile per questa settimana.')
      setCorsi([])
    } finally {
      setLoading(false)
    }
  }

  const fetchInsegnanti = async () => {
    try {
      const response = await apiClient.get('/insegnanti')
      setInsegnanti(response.data || [])
    } catch (error) {
      console.error('❌ Errore nel recupero degli insegnanti:', error)
    }
  }

  const fetchLivelli = async () => {
    try {
      const response = await apiClient.get('/livelli') // ✅ Ora chiama l'endpoint giusto
      setLivelli(response.data || [])
    } catch (error) {
      console.error('❌ Errore nel recupero dei livelli:', error)
      setLivelli([])
    }
  }

  // Naviga avanti o indietro nelle settimane
  const cambiaSettimana = (direzione) => {
    setSettimana(settimana.clone().add(direzione, 'weeks'))
  }

  const giorniSettimana = [
    'Lunedì',
    'Martedì',
    'Mercoledì',
    'Giovedì',
    'Venerdì',
    'Sabato',
  ]

  return (
    <>
      <AdminNavbar />

      <div className="container mt-4">
        <h2 className="text-center mb-4">📅 Calendario Corsi</h2>

        {/* Sezione Filtri */}
        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label">🎓 Seleziona Insegnante:</label>
            <select
              className="form-select"
              value={filtroInsegnante}
              onChange={(e) => setFiltroInsegnante(e.target.value)}
            >
              <option value="">Tutti</option>
              {insegnanti.map((insegnante) => (
                <option key={insegnante.id} value={insegnante.id}>
                  {insegnante.nome} {insegnante.cognome}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">📚 Seleziona Livello:</label>
            <select
              className="form-select"
              value={filtroLivello}
              onChange={(e) => setFiltroLivello(e.target.value)}
            >
              <option value="">Tutti</option>
              {livelli.map((livello) => (
                <option key={livello} value={livello}>
                  {livello}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4 d-flex align-items-end">
            <button
              className="btn btn-secondary w-100"
              onClick={() => {
                setFiltroInsegnante('')
                setFiltroLivello('')
              }}
            >
              🔄 Reset Filtri
            </button>
          </div>
        </div>

        {/* Navigazione tra le settimane */}
        <div className="d-flex justify-content-between mb-3">
          <button
            className="btn btn-outline-primary"
            onClick={() => cambiaSettimana(-1)}
          >
            ⬅️ Settimana Precedente
          </button>
          <h5>
            {settimana.startOf('isoWeek').format('DD MMMM YYYY')} -{' '}
            {settimana.endOf('isoWeek').format('DD MMMM YYYY')}
          </h5>
          <button
            className="btn btn-outline-primary"
            onClick={() => cambiaSettimana(1)}
          >
            Settimana Successiva ➡️
          </button>
        </div>

        {loading ? (
          <p>⏳ Caricamento in corso...</p>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <table className="table table-bordered text-center">
            <thead>
              <tr>
                <th>Ora</th>
                {giorniSettimana.map((giorno) => (
                  <th key={giorno}>{giorno}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                '08:00-10:00',
                '10:00-12:00',
                '12:00-14:00',
                '14:00-16:00',
                '16:00-18:00',
                '18:00-20:00',
              ].map((orario) => (
                <tr key={orario}>
                  <td>{orario}</td>
                  {giorniSettimana.map((giorno) => {
                    const corso = corsi.find(
                      (c) => c.giorno === giorno && c.orario === orario
                    )
                    return (
                      <td
                        key={giorno + orario}
                        className={corso ? 'bg-primary text-white' : 'bg-light'}
                      >
                        {corso ? (
                          <>
                            <strong>
                              {corso.lingua} ({corso.livello || 'N/A'})
                            </strong>
                            <br />
                            🏫 {corso.aula?.nome || 'N/A'}
                            <br />
                            👨‍🏫 {corso.insegnante?.nome}{' '}
                            {corso.insegnante?.cognome}
                          </>
                        ) : (
                          <span>-</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}

export default Calendario
