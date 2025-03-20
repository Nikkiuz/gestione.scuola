import { useEffect, useState } from 'react'
import apiClient from '../api/apiClient'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import AdminNavbar from '../components/AdminNavbar'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { registerLocale } from 'react-datepicker'
import it from 'date-fns/locale/it' // Localizzazione italiana

registerLocale('it', it)

const Report = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [insegnante, setInsegnante] = useState('')
  const [listaInsegnanti, setListaInsegnanti] = useState([])

  // Estrai mese e anno dalla data selezionata
  const anno = selectedDate.getFullYear()
  const mese = selectedDate.getMonth() + 1 

  // Fetch Report Mensile
  const fetchReportMensile = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await apiClient.get(
        `/report/mensile?anno=${anno}&mese=${mese}`
      )
      console.log('📊 Report ricevuto:', response.data)
      setReport(response.data)
    } catch (error) {
      console.error('Errore nel recupero del report', error)
      setError('Errore nel caricamento del report.')
    } finally {
      setLoading(false)
    }
  }

  // Fetch lista insegnanti
  const fetchInsegnanti = async () => {
    try {
      const response = await apiClient.get('/insegnanti')
      setListaInsegnanti(response.data)
    } catch (error) {
      console.error('Errore nel recupero degli insegnanti', error)
    }
  }

  // Scarica il report PDF mensile
  const scaricaReportPdf = async () => {
    try {
      const response = await apiClient.get(
        `/report/mensile/pdf?anno=${anno}&mese=${mese}`,
        {
          responseType: 'blob',
        }
      )
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `Report_${mese}_${anno}.pdf`)
      document.body.appendChild(link)
      link.click()
    } catch (error) {
      console.error('Errore nel download del report', error)
      setError('Errore nel download del report.')
    }
  }

  // Scarica il report PDF per un singolo insegnante
  const scaricaOreInsegnante = async () => {
    if (!insegnante) {
      alert('Seleziona un insegnante prima di scaricare il report.')
      return
    }
    try {
      const response = await apiClient.get(
        `/report/insegnante/pdf?anno=${anno}&mese=${mese}&insegnanteId=${insegnante}`,
        { responseType: 'blob' }
      )
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `Report_Insegnante_${mese}_${anno}.pdf`)
      document.body.appendChild(link)
      link.click()
    } catch (error) {
      console.error('Errore nel download del report insegnante', error)
      setError('Errore nel download del report insegnante.')
    }
  }

  useEffect(() => {
    fetchReportMensile()
    fetchInsegnanti()
  }, [anno, mese])

  return (
    <>
      <AdminNavbar />
      <div className="container mt-5">
        <h2 className="text-center mb-4">📊 Report Mensile</h2>

        {/* DatePicker per selezionare mese e anno */}
        <div className="d-flex justify-content-center mb-3">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="MMMM yyyy"
            showMonthYearPicker
            locale="it"
            className="form-control text-center fw-bold"
          />
        </div>

        {/* Bottone per scaricare il PDF */}
        <div className="d-flex justify-content-center mb-4">
          <button className="btn btn-primary" onClick={scaricaReportPdf}>
            📥 Scarica PDF
          </button>
        </div>

        {loading ? (
          <p>Caricamento in corso...</p>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : report ? (
          <>
            {/* Box delle statistiche */}
            <div className="row mb-4">
              <div className="col-md-3">
                <div className="card p-4 text-center shadow">
                  <h5>💰 Totale Entrate</h5>
                  <h2>€ {(report.totaleEntrate ?? 0).toFixed(2)}</h2>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card p-4 text-center shadow">
                  <h5>📉 Totale Uscite</h5>
                  <h2>€ {(report.totaleUscite ?? 0).toFixed(2)}</h2>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card p-4 text-center shadow">
                  <h5>🕒 Ore Insegnate</h5>
                  <h2>{report.totaleOreInsegnate ?? 0} ore</h2>
                </div>
              </div>

              <div className="col-md-3">
                <div
                  className={`card p-4 text-center shadow ${
                    report.bilancio >= 0
                      ? 'bg-success text-white'
                      : 'bg-danger text-white'
                  }`}
                >
                  <h5>📊 Bilancio</h5>
                  <h2>€ {(report.bilancio ?? 0).toFixed(2)}</h2>
                </div>
              </div>
            </div>

            {/* Grafico con Recharts */}
            <div className="mt-5">
              <h4>📈 Entrate, Uscite e Ore Insegnate</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    {
                      name: 'Entrate',
                      valore: report?.totaleEntrate ?? 0,
                      fill: '#28a745',
                    }, // Verde
                    {
                      name: 'Uscite',
                      valore: report?.totaleUscite ?? 0,
                      fill: '#dc3545',
                    }, // Rosso
                    {
                      name: 'Ore Insegnate',
                      valore: report?.totaleOreInsegnate ?? 0,
                      fill: '#007bff',
                    }, // Blu
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />{' '}
                  {/* Mostra i nomi delle categorie sull'asse X */}
                  <YAxis allowDecimals={false} />
                  <Tooltip formatter={(value) => `${value}`} />
                  {/* Un solo componente Bar con fill dinamico */}
                  <Bar
                    dataKey="valore"
                    fill={(entry) => entry.fill}
                    barSize={50}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Selettore per report insegnante */}
            <div className="mt-4">
              <h5>📘 Report per Insegnante</h5>
              <select
                className="form-select mb-2"
                value={insegnante}
                onChange={(e) => setInsegnante(e.target.value)}
              >
                <option value="">Seleziona Insegnante</option>
                {listaInsegnanti.map((ins) => (
                  <option key={ins.id} value={ins.id}>
                    {ins.nome} {ins.cognome}
                  </option>
                ))}
              </select>
              <button
                className="btn btn-primary mb-3"
                onClick={scaricaOreInsegnante}
              >
                📥 Scarica Report Insegnante
              </button>
            </div>
          </>
        ) : (
          <p>Nessun dato disponibile per il periodo selezionato.</p>
        )}
      </div>
    </>
  )
}

export default Report
