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

  useEffect(() => {
    fetchReportMensile()
  }, [anno, mese])

  const fetchReportMensile = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await apiClient.get(
        `/report/mensile?anno=${anno}&mese=${mese}`
      )
      setReport(response.data)
    } catch (error) {
      console.error('Errore nel recupero del report', error)
      setError('Errore nel caricamento del report.')
    } finally {
      setLoading(false)
    }
  }

  const scaricaReportPdf = async () => {
    try {
      const response = await apiClient.get(
        `/report/mensile/pdf?anno=${anno}&mese=${mese}`,
        {
          responseType: 'blob', // Imposta la risposta come file
        }
      )

      // Crea un link per scaricare il file
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
          <button className="btn btn-primary w-100" onClick={scaricaReportPdf}>
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
                <h2>€ {report.totaleEntrate.toFixed(2)}</h2>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card p-4 text-center shadow">
                <h5>📉 Totale Uscite</h5>
                <h2>€ {report.totaleUscite.toFixed(2)}</h2>
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
                <h2>€ {report.bilancio.toFixed(2)}</h2>
              </div>
            </div>
          </div>

          {/* Grafico Pagamenti vs Spese */}
          <div className="mt-5">
            <h4>📈 Entrate vs Uscite</h4>
            <Bar
              data={{
                labels: ['Entrate', 'Uscite'],
                datasets: [
                  {
                    label: '€',
                    data: [report.totaleEntrate, report.totaleUscite],
                    backgroundColor: ['#28a745', '#dc3545'],
                  },
                ],
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
                {Object.entries(report.speseRegistrate).map(
                  ([categoria, importo]) => (
                    <tr key={categoria}>
                      <td>{categoria}</td>
                      <td className="text-danger">-€ {importo.toFixed(2)}</td>
                    </tr>
                  )
                )}
                {Object.entries(report.pagamentiRicevuti).map(
                  ([metodo, importo]) => (
                    <tr key={metodo}>
                      <td>{metodo}</td>
                      <td className="text-success">€ {importo.toFixed(2)}</td>
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
