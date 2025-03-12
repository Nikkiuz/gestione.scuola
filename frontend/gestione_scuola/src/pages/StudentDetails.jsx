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
  const [importoPagamento, setImportoPagamento] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [modifica, setModifica] = useState(false)

  useEffect(() => {
    fetchDatiStudente()
  }, [])

  // 🔹 Recupera i dettagli dello studente, corsi e pagamenti in una sola chiamata
  const fetchDatiStudente = async () => {
    try {
      const [studenteRes, corsiRes, pagamentiRes] = await Promise.all([
        apiClient.get(`/studenti/${id}`),
        apiClient.get(`/studenti/${id}/corsi`),
        apiClient.get(`/studenti/${id}/pagamenti`),
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

  // 🔹 Rimuove lo studente da un corso
  const rimuoviDaCorso = async (corsoId) => {
    if (window.confirm('Vuoi rimuovere lo studente da questo corso?')) {
      try {
        await apiClient.delete(`/studenti/${id}/rimuovi-da-corso/${corsoId}`)
        fetchDatiStudente() // Aggiorna i dati dopo la rimozione
      } catch (error) {
        console.error('Errore nella rimozione dal corso', error)
      }
    }
  }

  // 🔹 Aggiunge un pagamento
  const aggiungiPagamento = async () => {
    if (!importoPagamento) {
      alert('Inserisci un importo valido.')
      return
    }

    try {
      await apiClient.post(`/studenti/${id}/pagamenti`, {
        importo: parseFloat(importoPagamento),
      })
      setImportoPagamento('')
      fetchDatiStudente()
    } catch (error) {
      console.error('Errore nell’aggiunta del pagamento', error)
    }
  }

  // 🔹 Elimina lo studente solo se non ha corsi assegnati
  const eliminaStudente = async () => {
    if (corsi.length > 0) {
      alert(
        '⚠️ Questo studente è ancora iscritto a un corso e non può essere eliminato.'
      )
      return
    }

    if (window.confirm('Sei sicuro di voler eliminare questo studente?')) {
      try {
        await apiClient.delete(`/studenti/${id}`)
        navigate('/studenti')
      } catch (error) {
        console.error('Errore nella cancellazione dello studente', error)
      }
    }
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
            <label className="form-label">Livello</label>
            <input
              type="text"
              name="livello"
              className="form-control"
              value={studente.livello}
              onChange={handleChange}
              disabled={!modifica}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Tipologia di Pagamento</label>
            <input
              type="text"
              name="tipologiaPagamento"
              className="form-control"
              value={studente.tipologiaPagamento}
              onChange={handleChange}
              disabled={!modifica}
            />
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

          <button
            type="button"
            className="btn btn-danger ms-3"
            onClick={eliminaStudente}
          >
            🗑 Elimina Studente
          </button>
        </form>

        {/* 🔹 Corsi Assegnati */}
        <div className="mt-4">
          <h5>📚 Corsi Assegnati</h5>
          {corsi.length === 0 ? (
            <p>Nessun corso assegnato</p>
          ) : (
            <ul className="list-group">
              {corsi.map((corso) => (
                <li
                  key={corso.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {corso.lingua} - {corso.livello} ({corso.giorno} -{' '}
                  {corso.orario})
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => rimuoviDaCorso(corso.id)}
                  >
                    ❌ Rimuovi
                  </button>
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
            <ul className="list-group">
              {pagamenti.map((pagamento) => (
                <li key={pagamento.id} className="list-group-item">
                  {new Date(pagamento.dataPagamento).toLocaleDateString()} - 💵
                  €{pagamento.importo}
                </li>
              ))}
            </ul>
          )}

          {/* Aggiungi pagamento */}
          <div className="mt-3">
            <input
              type="number"
              className="form-control"
              placeholder="Importo (€)"
              value={importoPagamento}
              onChange={(e) => setImportoPagamento(e.target.value)}
            />
            <button
              className="btn btn-success mt-2"
              onClick={aggiungiPagamento}
            >
              ➕ Aggiungi Pagamento
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default StudentDetail
