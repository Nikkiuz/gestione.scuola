import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import apiClient from '../api/apiClient'
import AdminNavbar from '../components/AdminNavbar'

const StudentDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [studente, setStudente] = useState(null)
  const [corsi, setCorsi] = useState([])
  const [pagamenti, setPagamenti] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [modifica, setModifica] = useState(false)

  useEffect(() => {
    fetchDatiStudente()
  }, [])

  // 🔹 Recupera i dettagli dello studente, corsi e pagamenti
  const fetchDatiStudente = async () => {
    try {
      const [studenteRes, corsiRes, pagamentiRes] = await Promise.all([
        apiClient.get(`/studenti/${id}`),
        apiClient.get(`/studenti/${id}/corsi`),
        apiClient.get(`/pagamenti/studente/${id}`),
      ])

      setStudente(studenteRes.data)
      setCorsi(corsiRes.data)
      setPagamenti(pagamentiRes.data)
    } catch (error) {
      console.error('Errore nel recupero dei dati dello studente', error)
      setError('Errore nel caricamento dei dati.')
    } finally {
      setLoading(false)
    }
  }

  // 🔹 Modifica i dati dello studente
  const handleChange = (e) => {
    setStudente({ ...studente, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await apiClient.put(`/studenti/${id}`, studente)
      setModifica(false)
    } catch (error) {
      console.error('Errore nella modifica dello studente', error)
    }
  }

  // 🔹 Aggiunge un pagamento → Reindirizza al form di aggiunta pagamento
  const aggiungiPagamento = () => {
    navigate(`/studenti/${id}/aggiungi-pagamento`)
  }

  if (loading) return <p>Caricamento in corso...</p>
  if (error) return <div className="alert alert-danger">{error}</div>

  return (
    <>
      <AdminNavbar />
      <div className="container mt-4">
        <h2 className="text-center mb-4">🎓 Dettagli Studente</h2>

        {/* 🔹 Modifica Studente */}
        <form onSubmit={handleSubmit} className="card shadow p-4">
          <h5>👤 Informazioni Studente</h5>

          <div className="mb-3">
            <label className="form-label">Nome</label>
            <input
              type="text"
              name="nome"
              className="form-control"
              value={studente.nome}
              onChange={handleChange}
              disabled={!modifica}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Cognome</label>
            <input
              type="text"
              name="cognome"
              className="form-control"
              value={studente.cognome}
              onChange={handleChange}
              disabled={!modifica}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Tipologia di Pagamento</label>
            <select
              name="tipologiaPagamento"
              className="form-select"
              value={studente.tipologiaPagamento}
              onChange={handleChange}
              disabled={!modifica}
            >
              <option value="PACCHETTO">Pacchetto</option>
              <option value="SINGOLA">Singola</option>
              <option value="ALTRO">Altro</option>
            </select>
          </div>

          {modifica ? (
            <button type="submit" className="btn btn-success">
              💾 Salva Modifiche
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setModifica(true)}
            >
              ✏️ Modifica
            </button>
          )}
        </form>

        {/* 🔹 Corsi Assegnati */}
        <div className="mt-4">
          <h5>📚 Corsi Assegnati</h5>
          {corsi.length === 0 ? (
            <p>Nessun corso assegnato</p>
          ) : (
            <ul className="list-group">
              {corsi.map((corso) => (
                <li key={corso.id} className="list-group-item">
                  {corso.lingua} - {corso.livello} ({corso.giorno} -{' '}
                  {corso.orario})
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 🔹 Pagamenti */}
        <div className="mt-4">
          <h5>💰 Pagamenti</h5>
          {pagamenti.length === 0 ? (
            <p>Nessun pagamento registrato</p>
          ) : (
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Importo</th>
                  <th>Metodo</th>
                  <th>Mensilità</th>
                  <th>Numero Ricevuta</th>
                </tr>
              </thead>
              <tbody>
                {pagamenti.map((pagamento) => (
                  <tr key={pagamento.id}>
                    <td>
                      {new Date(pagamento.dataPagamento).toLocaleDateString()}
                    </td>
                    <td>€{pagamento.importo}</td>
                    <td>{pagamento.metodoPagamento}</td>
                    <td>{pagamento.mensilitaSaldata}</td>
                    <td>{pagamento.numeroRicevuta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* 🔹 Bottone per aggiungere pagamento */}
          <button className="btn btn-success mt-2" onClick={aggiungiPagamento}>
            ➕ Aggiungi Pagamento
          </button>
        </div>
      </div>
    </>
  )
}

export default StudentDetail
