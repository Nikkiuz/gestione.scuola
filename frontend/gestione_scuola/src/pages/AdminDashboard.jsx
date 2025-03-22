import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/apiClient'
import { Bar } from 'react-chartjs-2'
import 'chart.js/auto'
import AdminNavbar from '../components/AdminNavbar'

const AdminDashboard = () => {
  const [stats, setStats] = useState({ studenti: 0, corsi: 0, pagamenti: 0 })
  const [dashboardAvvisi, setDashboardAvvisi] = useState([])
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

        const [statsRes, avvisiRes, pagamentiRes] = await Promise.all([
          apiClient.get('/dashboard/stats'),
          apiClient.get('/dashboard/avvisi'),
          apiClient.get('/dashboard/pagamenti-mensili'),
        ])

        setStats(statsRes.data || { studenti: 0, corsi: 0, pagamenti: 0 })
        setDashboardAvvisi(avvisiRes.data || [])
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

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: '📊 Pagamenti Mensili (€)',
        font: { size: 16 },
      },
      tooltip: {
        callbacks: {
          label: (context) => `€ ${context.raw.toLocaleString('it-IT')}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `€ ${value.toLocaleString('it-IT')}`,
        },
      },
      x: {
        ticks: { font: { size: 14 } },
      },
    },
  }

  return (
    <>
      <AdminNavbar />
      <div className="container mt-5">
        <h2 className="text-center mb-4">Dashboard Admin</h2>
        {loading && <p className="text-center">⏳ Caricamento dati...</p>}
        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && (
          <div className="mb-4">
            {dashboardAvvisi.length > 0 ? (
              dashboardAvvisi.map((avviso, index) => (
                <div
                  key={index}
                  className="alert alert-warning"
                  onClick={() => navigate(avviso.link)}
                  style={{ cursor: 'pointer' }}
                >
                  {avviso.messaggio}
                </div>
              ))
            ) : (
              <div className="alert alert-success">Nessun avviso</div>
            )}
          </div>
        )}

        {!loading && !error && (
          <div className="row">
            <div className="col-md-4">
              <div
                className="card p-4 text-center shadow"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('/studenti')}
              >
                <h5>📌 Studenti</h5>
                <h2>{stats.studenti}</h2>
              </div>
            </div>
            <div className="col-md-4">
              <div
                className="card p-4 text-center shadow"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('/corsi')}
              >
                <h5>📌 Corsi Attivi</h5>
                <h2>{stats.corsi}</h2>
              </div>
            </div>
            <div className="col-md-4">
              <div
                className="card p-4 text-center shadow"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('/report')}
              >
                <h5>💰 Totale Pagamenti</h5>
                <h2>€ {stats.pagamenti}</h2>
              </div>
            </div>
          </div>
        )}

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
                    borderColor: '#0056b3',
                    borderWidth: 2,
                    barThickness: 40,
                    borderRadius: 5,
                  },
                ],
              }}
              options={chartOptions}
            />
          </div>
        )}
      </div>
    </>
  )
}

export default AdminDashboard
