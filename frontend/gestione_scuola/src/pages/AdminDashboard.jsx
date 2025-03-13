import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/apiClient'
import { Bar } from 'react-chartjs-2'
import 'chart.js/auto'
import AdminNavbar from '../components/AdminNavbar'

const AdminDashboard = () => {
  const [stats, setStats] = useState({ studenti: 0, corsi: 0, pagamenti: 0 })
  const [avvisi, setAvvisi] = useState([])
  const [pagamentiMensili, setPagamentiMensili] = useState({
    labels: [],
    data: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Eseguiamo tutte le chiamate API in parallelo
        const [statsRes, avvisiRes, pagamentiRes] = await Promise.all([
          apiClient.get('/dashboard/stats'),
          apiClient.get('/dashboard/avvisi'),
          apiClient.get('/dashboard/pagamenti-mensili'),
        ])

        setStats(statsRes.data || { studenti: 0, corsi: 0, pagamenti: 0 })
        setAvvisi(avvisiRes.data || [])
        setPagamentiMensili({
          labels: pagamentiRes.data?.mesi || [],
          data: pagamentiRes.data?.importi || [],
        })
      } catch (err) {
        console.error('❌ Errore nel caricamento dati:', err)
        setError('Errore nel caricamento della dashboard. Riprova più tardi.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <>
      <AdminNavbar />
      <div className="container mt-5">
        <h2 className="text-center mb-4">Dashboard Admin</h2>

        {/* Stato di caricamento o errore */}
        {loading && <p className="text-center">⏳ Caricamento dati...</p>}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Sezione Avvisi */}
        {!loading && !error && (
          <div className="mb-4">
            {avvisi.length > 0 ? (
              avvisi.map((avviso, index) => (
                <div
                  key={index}
                  className="alert alert-warning"
                  onClick={() => navigate(avviso.link)}
                >
                  {avviso.messaggio}
                </div>
              ))
            ) : (
              <div className="alert alert-success">Nessun avviso</div>
            )}
          </div>
        )}

        {/* Sezione Statistiche */}
        {!loading && !error && (
          <div className="row">
            <div className="col-md-4">
              <div className="card p-4 text-center shadow">
                <h5>📌 Studenti</h5>
                <h2>{stats.studenti}</h2>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card p-4 text-center shadow">
                <h5>📌 Corsi Attivi</h5>
                <h2>{stats.corsi}</h2>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card p-4 text-center shadow">
                <h5>💰 Totale Pagamenti</h5>
                <h2>€ {stats.pagamenti}</h2>
              </div>
            </div>
          </div>
        )}

        {/* Sezione Grafici */}
        {!loading && !error && pagamentiMensili.labels.length > 0 && (
          <div className="mt-5">
            <h4>📈 Andamento Pagamenti Mensili</h4>
            <Bar
              data={{
                labels: pagamentiMensili.labels,
                datasets: [
                  {
                    label: 'Pagamenti Mensili (€)',
                    data: pagamentiMensili.data,
                    backgroundColor: '#007bff',
                  },
                ],
              }}
            />
          </div>
        )}
      </div>
    </>
  )
}

export default AdminDashboard
