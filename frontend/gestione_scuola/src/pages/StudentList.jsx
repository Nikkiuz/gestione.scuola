import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/apiClient'
import AdminNavbar from '../components/AdminNavbar'

const StudentList = () => {
  const [studenti, setStudenti] = useState([])
  const [studentiSenzaCorso, setStudentiSenzaCorso] = useState([])
  const [filtroNome, setFiltroNome] = useState('')
  const [filtroCognome, setFiltroCognome] = useState('')
  const [filtroLivello, setFiltroLivello] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchStudenti()
  }, [])

  // 🔹 Recupera tutti gli studenti
  const fetchStudenti = async () => {
    try {
      setError('')
      const response = await apiClient.get('/studenti')
      setStudenti(response.data.filter((s) => s.corsi.length > 0))
      setStudentiSenzaCorso(response.data.filter((s) => s.corsi.length === 0))
    } catch (error) {
      console.error('Errore nel recupero degli studenti', error)
      setError('❌ Errore nel caricamento degli studenti.')
    }
  }

  // 🔹 Filtra gli studenti in base ai criteri di ricerca
  const filtraStudenti = (lista) => {
    return lista.filter(
      (s) =>
        s.nome.toLowerCase().includes(filtroNome.toLowerCase()) &&
        s.cognome.toLowerCase().includes(filtroCognome.toLowerCase()) &&
        (s.livello
          ? s.livello.toLowerCase().includes(filtroLivello.toLowerCase())
          : true)
    )
  }

  // 🔥 Funzione per eliminare uno studente
  const eliminaStudente = async (id) => {
    if (
      window.confirm(
        '⚠️ Sei sicuro di voler eliminare questo studente? Questa azione è irreversibile.'
      )
    ) {
      try {
        await apiClient.delete(`/studenti/${id}`)
        fetchStudenti() // 🔄 Aggiorna la lista dopo l'eliminazione
      } catch (error) {
        console.error('Errore nell’eliminazione dello studente', error)
        alert(error.response?.data?.message || '❌ Errore nella cancellazione.')
      }
    }
  }

  return (
    <>
      <AdminNavbar />
      <div className="container mt-4">
        <h2 className="text-center mb-4">🎓 Gestione Studenti</h2>

        {/* Messaggio di errore se il recupero dati fallisce */}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Pulsante per aggiungere un nuovo studente */}
        <button
          className="btn btn-success mb-3"
          onClick={() => navigate('/studenti/nuovo')}
        >
          ➕ Aggiungi Studente
        </button>

        {/* Filtri di ricerca */}
        <div className="row mb-3">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="🔎 Filtra per nome"
              value={filtroNome}
              onChange={(e) => setFiltroNome(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="🔎 Filtra per cognome"
              value={filtroCognome}
              onChange={(e) => setFiltroCognome(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="🔎 Filtra per livello"
              value={filtroLivello}
              onChange={(e) => setFiltroLivello(e.target.value)}
            />
          </div>
        </div>

        {/* Studenti Assegnati a un Corso */}
        <h4>📌 Studenti con Corso</h4>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Cognome</th>
              <th>Livello</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {filtraStudenti(studenti).map((studente) => (
              <tr key={studente.id}>
                <td>{studente.nome}</td>
                <td>{studente.cognome}</td>
                <td>{studente.livello || 'N/A'}</td>{' '}
                {/* Evita errori se livello è null */}
                <td>
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => navigate(`/studenti/${studente.id}`)}
                  >
                    📄 Dettagli
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => eliminaStudente(studente.id)}
                  >
                    🗑 Elimina
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Studenti Senza Corso */}
        <h4 className="mt-4">⚠️ Studenti Senza Corso</h4>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Cognome</th>
              <th>Livello</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {filtraStudenti(studentiSenzaCorso).map((studente) => (
              <tr key={studente.id}>
                <td>{studente.nome}</td>
                <td>{studente.cognome}</td>
                <td>{studente.livello || 'N/A'}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => navigate(`/studenti/${studente.id}`)}
                  >
                    📄 Dettagli
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => eliminaStudente(studente.id)}
                  >
                    🗑 Elimina
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default StudentList
