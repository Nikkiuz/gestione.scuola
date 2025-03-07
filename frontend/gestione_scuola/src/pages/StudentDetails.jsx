import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import apiClient from '../api/apiClient'

const StudentDetail = () => {
  const { id } = useParams()
  const [studente, setStudente] = useState(null)
  const [corsi, setCorsi] = useState([])
  const [pagamenti, setPagamenti] = useState([])
  const [importoPagamento, setImportoPagamento] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStudente()
    fetchCorsi()
    fetchPagamenti()
  }, [])

  // 🔹 Recupera i dettagli dello studente
  const fetchStudente = async () => {
    try {
      const response = await apiClient.get(`/studenti/${id}`)
      setStudente(response.data)
    } catch (error) {
      console.error('Errore nel recupero dello studente', error)
      setError('Errore nel caricamento dello studente.')
    } finally {
      setLoading(false)
    }
  }

  // 🔹 Recupera i corsi dello studente
  const fetchCorsi = async () => {
    try {
      const response = await apiClient.get(`/studenti/${id}/corsi`)
      setCorsi(response.data)
    } catch (error) {
      console.error('Errore nel recupero dei corsi', error)
    }
  }

  // 🔹 Recupera i pagamenti dello studente
  const fetchPagamenti = async () => {
    try {
      const response = await apiClient.get(`/studenti/${id}/pagamenti`)
      setPagamenti(response.data)
    } catch (error) {
      console.error('Errore nel recupero dei pagamenti', error)
    }
  }

  // 🔹 Rimuove lo studente da un corso
  const rimuoviDaCorso = async (corsoId) => {
    if (window.confirm('Vuoi rimuovere lo studente da questo corso?')) {
      try {
        await apiClient.delete(`/studenti/${id}/rimuovi-da-corso/${corsoId}`)
        fetchCorsi() // Aggiorna la lista dei corsi
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
      fetchPagamenti() // Aggiorna la lista pagamenti
    } catch (error) {
      console.error('Errore nell’aggiunta del pagamento', error)
    }
  }

  if (loading) return <p>Caricamento in corso...</p>
  if (error) return <div className="alert alert-danger">{error}</div>

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">🎓 Dettagli Studente</h2>

      {studente && (
        <div className="card shadow p-4">
          <h5>
            {studente.nome} {studente.cognome}
          </h5>
          <p>
            <strong>🕒 Età:</strong> {studente.eta}
          </p>
          <p>
            <strong>🌍 Lingua da imparare:</strong> {studente.linguaDaImparare}
          </p>
          <p>
            <strong>📖 Livello:</strong> {studente.livello}
          </p>
          <p>
            <strong>🧑‍🏫 Insegnante preferito:</strong>{' '}
            {studente.insegnante
              ? `${studente.insegnante.nome} ${studente.insegnante.cognome}`
              : 'Nessuno'}
          </p>
          <p>
            <strong>💳 Tipo di pagamento:</strong> {studente.tipologiaPagamento}
          </p>
        </div>
      )}

      {/* Lista corsi */}
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

      {/* Lista pagamenti */}
      <div className="mt-4">
        <h5>💰 Pagamenti</h5>
        {pagamenti.length === 0 ? (
          <p>Nessun pagamento registrato</p>
        ) : (
          <ul className="list-group">
            {pagamenti.map((pagamento) => (
              <li key={pagamento.id} className="list-group-item">
                {new Date(pagamento.dataPagamento).toLocaleDateString()} - 💵 €
                {pagamento.importo}
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
          <button className="btn btn-success mt-2" onClick={aggiungiPagamento}>
            ➕ Aggiungi Pagamento
          </button>
        </div>
      </div>
    </div>
  )
}

export default StudentDetail
