import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/apiClient'

const TeacherDashboard = () => {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [stats, setStats] = useState({ corsi: 0, studenti: 0, ore: 0 })
  const [corsi, setCorsi] = useState([])
  const [corsiVuoti, setCorsiVuoti] = useState([])

  useEffect(() => {
    if (!user || user.role !== 'INSEGNANTE') {
      navigate('/login')
    } else {
      fetchStats()
      fetchCorsi()
    }
  }, [user, navigate])

  // 🔹 Recupera statistiche insegnante
  const fetchStats = async () => {
    try {
      const response = await apiClient.get(`/insegnanti/${user.id}/stats`)
      setStats(response.data)
    } catch (error) {
      console.error('Errore nel recupero delle statistiche', error)
    }
  }

  // 🔹 Recupera corsi dell'insegnante
  const fetchCorsi = async () => {
    try {
      const response = await apiClient.get(`/insegnanti/${user.id}/corsi`)
      setCorsi(response.data)

      // Trova corsi senza studenti
      const corsiSenzaStudenti = response.data.filter(
        (corso) => corso.studenti.length === 0
      )
      setCorsiVuoti(corsiSenzaStudenti)
    } catch (error) {
      console.error('Errore nel recupero dei corsi', error)
    }
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">👨‍🏫 Benvenuto {user?.nome}!</h2>

      {/* Sezione Statistiche */}
      <div className="row">
        <div className="col-md-4">
          <div className="card p-4 text-center shadow">
            <h5>📌 Corsi Assegnati</h5>
            <h2>{stats.corsi}</h2>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-4 text-center shadow">
            <h5>📌 Studenti Totali</h5>
            <h2>{stats.studenti}</h2>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-4 text-center shadow">
            <h5>⏳ Ore Insegnate</h5>
            <h2>{stats.ore}</h2>
          </div>
        </div>
      </div>

      {/* Alert Corsi Senza Studenti */}
      {corsiVuoti.length > 0 && (
        <div className="alert alert-warning mt-4">
          ⚠️ Attenzione: Hai {corsiVuoti.length} corsi senza studenti assegnati!
        </div>
      )}

      {/* Lista corsi assegnati */}
      <h4 className="mt-4">📅 Prossimi Corsi</h4>
      <ul className="list-group">
        {corsi.length > 0 ? (
          corsi.slice(0, 5).map((corso) => (
            <li
              key={corso.id}
              className="list-group-item d-flex justify-content-between"
            >
              <span>
                {corso.lingua} - {corso.orario} ({corso.studenti.length}{' '}
                studenti)
              </span>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate(`/corsi/${corso.id}`)}
              >
                📖 Dettagli
              </button>
            </li>
          ))
        ) : (
          <li className="list-group-item">Nessun corso assegnato</li>
        )}
      </ul>

      {/* Bottoni Navigazione */}
      <div className="mt-4 d-flex justify-content-between">
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/miei-corsi')}
        >
          📚 I miei Corsi
        </button>
        <button
          className="btn btn-outline-primary"
          onClick={() => navigate('/profilo')}
        >
          ⚙️ Modifica Profilo
        </button>
      </div>
    </div>
  )
}

export default TeacherDashboard
