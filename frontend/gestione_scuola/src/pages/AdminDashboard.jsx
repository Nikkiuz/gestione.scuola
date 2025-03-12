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
  const navigate = useNavigate()

  useEffect(() => {
    fetchStats()
    fetchAvvisi()
    fetchPagamentiMensili()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await apiClient.get('/dashboard/stats')
      setStats(response.data)
    } catch (error) {
      console.error('Errore nel recupero delle statistiche', error)
    }
  }

  const fetchAvvisi = async () => {
    try {
      const response = await apiClient.get('/dashboard/avvisi')
      setAvvisi(response.data)
    } catch (error) {
      console.error('Errore nel recupero degli avvisi', error)
    }
  }

  const fetchPagamentiMensili = async () => {
    try {
      const response = await apiClient.get('/dashboard/pagamenti-mensili')
      setPagamentiMensili({
        labels: response.data.mesi,
        data: response.data.importi,
      })
    } catch (error) {
      console.error('Errore nel recupero dei pagamenti', error)
    }
  }

  return (
    <>
    <AdminNavbar />
    <div className="container mt-5">
      <h2 className="text-center mb-4">Dashboard Admin</h2>

      {/* Sezione Avvisi */}
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

      {/* Sezione Statistiche */}
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

      {/* Sezione Grafici */}
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
    </div>
    </>
  )
}

export default AdminDashboard
