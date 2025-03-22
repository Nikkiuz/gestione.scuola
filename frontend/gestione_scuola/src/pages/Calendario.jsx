import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/apiClient'
import moment from 'moment'
import 'moment/locale/it'
import AdminNavbar from '../components/AdminNavbar'

const Calendario = () => {
  const [settimana, setSettimana] = useState(moment())
  const [corsi, setCorsi] = useState([])
  const [insegnanti, setInsegnanti] = useState([])
  const [livelli, setLivelli] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [filtroInsegnante, setFiltroInsegnante] = useState('')
  const [filtroLivello, setFiltroLivello] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    fetchCorsi()
    fetchInsegnanti()
    fetchLivelli()
  }, [settimana, filtroInsegnante, filtroLivello])

  const fetchCorsi = async () => {
    setLoading(true)
    const giornoParam = settimana.startOf('isoWeek').format('YYYY-MM-DD')

    console.log('📅 Parametri invio API:', {
      giorno: giornoParam,
      insegnante: filtroInsegnante,
      livello: filtroLivello,
    })

    try {
      const response = await apiClient.get(`/calendario/corsi-programmati`, {
        params: {
          giorno: giornoParam,
          insegnante: filtroInsegnante,
          livello: filtroLivello,
        },
      })
      console.log('📦 Corsi ricevuti:', response.data)
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
      const response = await apiClient.get('/livelli')
      setLivelli(response.data || [])
    } catch (error) {
      console.error('❌ Errore nel recupero dei livelli:', error)
      setLivelli([])
    }
  }

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

  const normalizza = (str) =>
    str?.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

  return (
    <>
      <AdminNavbar />

      <div className="container mt-4">
        <h2 className="text-center mb-4">📅 Calendario Corsi</h2>

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
                    const corsiInSlot = corsi.filter(
                      (c) =>
                        normalizza(c.giorno) === normalizza(giorno) &&
                        c.orario === orario
                    )
                    return (
                      <td
                        key={giorno + orario}
                        className={
                          corsiInSlot.length
                            ? 'bg-primary text-white'
                            : 'bg-light'
                        }
                      >
                        {corsiInSlot.length ? (
                          corsiInSlot.map((corso) => (
                            <div
                              key={corso.corsoId}
                              onClick={() =>
                                navigate(`/corsi/${corso.corsoId}`)
                              }
                              style={{
                                cursor: 'pointer',
                                borderBottom: '1px solid white',
                                paddingBottom: '4px',
                                marginBottom: '4px',
                              }}
                            >
                              <strong>
                                {corso.lingua} ({corso.tipoCorso})
                              </strong>
                              <br />
                              🎯 Livello: {corso.livello || 'N/A'}
                              <br />
                              📆 {corso.frequenza}
                              <br />
                              🏫 {corso.aula || 'N/A'}
                              <br />
                              👨‍🏫 {corso.insegnante || 'N/A'}
                            </div>
                          ))
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
