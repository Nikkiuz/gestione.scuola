import { useEffect, useState } from 'react'
import apiClient from '../api/apiClient'
import { Bar } from 'react-chartjs-2'
import 'chart.js/auto'
import AdminNavbar from '../components/AdminNavbar'

const Report = () => {
  const [anno, setAnno] = useState(new Date().getFullYear())
  const [mese, setMese] = useState(new Date().getMonth() + 1) // Mesi in JS vanno da 0 a 11
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchReportMensile = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await apiClient.get(
        `/report/mensile?anno=${anno}&mese=${mese}`
      )
      console.log('📊 Report ricevuto:', response.data) // 🔍 Debug
      setReport(response.data)
    } catch (error) {
      console.error('Errore nel recupero del report', error)
      setError('Errore nel caricamento del report.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReportMensile()
  }, [anno, mese])

  useEffect(() => {
    console.log('📊 Report Aggiornato:', report) // 🔍 Debug
  }, [report])

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

  // ✅ Debug per verificare che i dati siano corretti prima di passarli al grafico
  console.log(
    '📊 Dati passati al grafico:',
    report?.totaleEntrate,
    report?.totaleUscite
  )

  return (
    <>
      <AdminNavbar />

      <div className="container mt-5">
        <h2 className="text-center mb-4">📊 Report Mensile</h2>

        {/* Sezione Filtri */}
        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label">📆 Seleziona Mese:</label>
            <select
              className="form-select"
              value={mese}
              onChange={(e) => setMese(Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString('it', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">📅 Seleziona Anno:</label>
            <select
              className="form-select"
              value={anno}
              onChange={(e) => setAnno(Number(e.target.value))}
            >
              {Array.from({ length: 5 }, (_, i) => (
                <option key={anno - i} value={anno - i}>
                  {anno - i}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4 d-flex align-items-end">
            <button
              className="btn btn-primary w-100"
              onClick={scaricaReportPdf}
            >
              📥 Scarica PDF
            </button>
          </div>
        </div>

        {/* Sezione Contenuti Report */}
        {loading ? (
          <p>Caricamento in corso...</p>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : report ? (
          <>
            {/* Statistiche Generali */}
            <div className="row mb-4">
              <div className="col-md-4">
                <div className="card p-4 text-center shadow">
                  <h5>💰 Totale Entrate</h5>
                  <h2>€ {(report.totaleEntrate ?? 0).toFixed(2)}</h2>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card p-4 text-center shadow">
                  <h5>📉 Totale Uscite</h5>
                  <h2>€ {(report.totaleUscite ?? 0).toFixed(2)}</h2>
                </div>
              </div>
              <div className="col-md-4">
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

            {/* Grafico Pagamenti vs Spese */}
            <div className="mt-5">
              <h4>📈 Entrate vs Uscite</h4>
              <Bar
                key={`${report?.totaleEntrate}-${report?.totaleUscite}`} // 👈 Forza il re-render se cambiano i dati
                data={{
                  labels: ['Entrate', 'Uscite'],
                  datasets: [
                    {
                      label: '€',
                      data: [
                        report?.totaleEntrate ?? 0,
                        report?.totaleUscite ?? 0,
                      ],
                      backgroundColor: ['#28a745', '#dc3545'],
                    },
                  ],
                }}
                options={{
                  scales: {
                    y: {
                      beginAtZero: true,
                      suggestedMax:
                        Math.max(
                          report?.totaleEntrate ?? 0,
                          report?.totaleUscite ?? 0
                        ) + 100,
                    },
                  },
                }}
              />
            </div>

            {/* Tabella Dettagliata */}
            <div className="mt-4">
              <h4>📋 Dettaglio Entrate e Uscite</h4>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Categoria</th>
                    <th>Importo (€)</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(report.speseRegistrate ?? {}).map(
                    ([categoria, importo]) => (
                      <tr key={categoria}>
                        <td>{categoria}</td>
                        <td className="text-danger">
                          -€ {(importo ?? 0).toFixed(2)}
                        </td>
                      </tr>
                    )
                  )}
                  {Object.entries(report.pagamentiRicevuti ?? {}).map(
                    ([metodo, importo]) => (
                      <tr key={metodo}>
                        <td>{metodo}</td>
                        <td className="text-success">
                          € {(importo ?? 0).toFixed(2)}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
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
