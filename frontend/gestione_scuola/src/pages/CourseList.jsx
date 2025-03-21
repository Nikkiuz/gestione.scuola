import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/apiClient'
import AdminNavbar from '../components/AdminNavbar'

const CourseList = () => {
  const [corsiGruppo, setCorsiGruppo] = useState([])
  const [corsiPrivati, setCorsiPrivati] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [generazioneInCorso, setGenerazioneInCorso] = useState(false)
  const [corsiDisattivati, setCorsiDisattivati] = useState([])
  const [listaAttesa, setListaAttesa] = useState([])
  const [studentiInListaAttesa, setStudentiInListaAttesa] = useState([])


  const navigate = useNavigate()

  // Funzione per caricare i corsi
  const fetchCorsi = async () => {
    setLoading(true)
    try {
      const response = await apiClient.get('/corsi')
      const disattivati = await apiClient.get('/corsi/disattivati')
      const listaAttesaRes = await apiClient.get('/corsi/lista-attesa/studenti')
      setStudentiInListaAttesa(listaAttesaRes.data || [])
      const corsi = response.data || []
      setCorsiGruppo(corsi.filter((c) => c.tipoCorso === 'GRUPPO'))
      setCorsiPrivati(corsi.filter((c) => c.tipoCorso === 'PRIVATO'))
      setCorsiDisattivati(disattivati.data || [])
    } catch (error) {
      console.error('❌ Errore nel recupero dei corsi:', error)
      setError('Errore nel caricamento dei corsi.')
    } finally {
      setLoading(false)
    }
  }


  // Effetto per caricare i corsi al montaggio del componente
 useEffect(() => {
   fetchCorsi()
   fetchCorsiDisattivati()
    fetchListaAttesa()
 }, [])


  // Funzione per disattivare un corso
  const disattivaCorso = async (id) => {
    if (window.confirm('Sei sicuro di voler disattivare questo corso?')) {
      try {
        await apiClient.put(`/corsi/${id}/interrompi`)
        sessionStorage.setItem('refreshReport', 'true') // ✅ Aggiorna report
        fetchCorsi() // Ricarica i corsi dopo la disattivazione
      } catch (error) {
        console.error('❌ Errore nella disattivazione del corso:', error)
        alert('Errore nella disattivazione del corso.')
      }
    }
  }

 const riattivaCorso = async (id) => {
   if (window.confirm('Vuoi riattivare questo corso?')) {
     try {
       await apiClient.put(`/corsi/${id}/riattiva`)
       fetchCorsi()
     } catch (error) {
       console.error('❌ Errore nella riattivazione del corso:', error)
       alert('Errore durante la riattivazione del corso.')
     }
   }
 }

  // Funzione per eliminare un corso
  const eliminaCorso = async (id) => {
    if (window.confirm('Eliminare definitivamente il corso?')) {
      try {
        await apiClient.delete(`/corsi/${id}`)
        sessionStorage.setItem('refreshReport', 'true') // ✅ Aggiorna report
        fetchCorsi() // Ricarica i corsi dopo l'eliminazione
      } catch (error) {
        console.error("❌ Errore nell'eliminazione del corso:", error)
        alert("Errore durante l'eliminazione del corso.")
      }
    }
  }

  // Funzione per generare corsi automaticamente
  const generaCorsiAutomaticamente = async () => {
    setGenerazioneInCorso(true)
    try {
      const response = await apiClient.post('/corsi/genera-automatico')
      alert(response.data || '✅ Corsi generati automaticamente con successo!')
      fetchCorsi() // Ricarica i corsi dopo la generazione
    } catch (error) {
      console.error('❌ Errore nella generazione automatica dei corsi:', error)
      alert('❌ Errore durante la generazione automatica dei corsi.')
    } finally {
      setGenerazioneInCorso(false)
    }
  }

  // Funzione per caricare corsi disattivati
  const fetchCorsiDisattivati = async () => {
    try {
      const response = await apiClient.get('/corsi/disattivati')
      setCorsiDisattivati(response.data || [])
    } catch (error) {
      console.error('❌ Errore nel recupero dei corsi disattivati:', error)
    }
  }

  const fetchListaAttesa = async () => {
    try {
      const response = await apiClient.get('/corsi/lista-attesa/studenti')
      setListaAttesa(response.data || [])
    } catch (error) {
      console.error('❌ Errore nel recupero della lista di attesa:', error)
    }
  }

  return (
    <>
      <AdminNavbar />

      <div className="container mt-5">
        <h2 className="text-center mb-4">📚 Gestione Corsi</h2>

        <div className="d-flex justify-content-between mb-3">
          <button
            className="btn btn-success"
            onClick={() => navigate('/corsi/nuovo')}
          >
            ➕ Crea Nuovo Corso
          </button>
          <button
            className="btn btn-primary"
            onClick={generaCorsiAutomaticamente}
            disabled={generazioneInCorso}
          >
            ⚙️{' '}
            {generazioneInCorso
              ? 'Generazione in corso...'
              : 'Genera Corsi Automaticamente'}
          </button>
        </div>

        {loading ? (
          <p>Caricamento...</p>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <>
            <h4>📌 Corsi di Gruppo</h4>
            {corsiGruppo.length === 0 ? (
              <p>Nessun corso di gruppo disponibile.</p>
            ) : (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Insegnante</th>
                    <th>Lingua</th>
                    <th>Livello</th>
                    <th>Giorno</th>
                    <th>Orario</th>
                    <th>Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {corsiGruppo.map((corso) => (
                    <tr key={corso.id}>
                      <td>
                        {corso.insegnante?.nome} {corso.insegnante?.cognome}
                      </td>
                      <td>{corso.lingua}</td>
                      <td>
                        <strong>{corso.livello || 'N/A'}</strong>
                      </td>
                      <td>{corso.giorno}</td>
                      <td>{corso.orario}</td>
                      <td>
                        <button
                          className="btn btn-info btn-sm me-2"
                          onClick={() => navigate(`/corsi/${corso.id}`)}
                        >
                          🔍 Dettagli
                        </button>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => disattivaCorso(corso.id)}
                        >
                          ⛔ Disattiva
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => eliminaCorso(corso.id)}
                        >
                          🗑️ Elimina
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <h4>📌 Corsi Privatisti</h4>
            {corsiPrivati.length === 0 ? (
              <p>Nessun corso privatista disponibile.</p>
            ) : (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Insegnante</th>
                    <th>Lingua</th>
                    <th>Livello</th>
                    <th>Giorno</th>
                    <th>Orario</th>
                    <th>Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {corsiPrivati.map((corso) => (
                    <tr key={corso.id}>
                      <td>
                        {corso.insegnante?.nome} {corso.insegnante?.cognome}
                      </td>
                      <td>{corso.lingua}</td>
                      <td>
                        <strong>{corso.livello || 'N/A'}</strong>
                      </td>
                      <td>{corso.giorno}</td>
                      <td>{corso.orario}</td>
                      <td>
                        <button
                          className="btn btn-info btn-sm me-2"
                          onClick={() => navigate(`/corsi/${corso.id}`)}
                        >
                          🔍 Dettagli
                        </button>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => disattivaCorso(corso.id)}
                        >
                          ⛔ Disattiva
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => eliminaCorso(corso.id)}
                        >
                          🗑️ Elimina
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

        <h4>📌 Corsi Disattivati</h4>
        {corsiDisattivati.length === 0 ? (
          <p>Nessun corso disattivato.</p>
        ) : (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Insegnante</th>
                <th>Lingua</th>
                <th>Livello</th>
                <th>Giorno</th>
                <th>Orario</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {corsiDisattivati.map((corso) => (
                <tr key={corso.id}>
                  <td>
                    {corso.insegnante?.nome} {corso.insegnante?.cognome}
                  </td>
                  <td>{corso.lingua}</td>
                  <td>
                    <strong>{corso.livello || 'N/A'}</strong>
                  </td>
                  <td>{corso.giorno}</td>
                  <td>{corso.orario}</td>
                  <td>
                    <button
                      className="btn btn-info btn-sm me-2"
                      onClick={() => navigate(`/corsi/${corso.id}`)}
                    >
                      🔍 Dettagli
                    </button>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => riattivaCorso(corso.id)}
                    >
                      ✅ Riattiva
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <h4>📌 Lista di Attesa</h4>
        {studentiInListaAttesa.length === 0 ? (
          <p>Nessuno studente in lista di attesa.</p>
        ) : (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Cognome</th>
                <th>Lingua</th>
                <th>Livello</th>
                <th>Età</th>
              </tr>
            </thead>
            <tbody>
              {studentiInListaAttesa.map((studente) => (
                <tr key={studente.id}>
                  <td>{studente.nome}</td>
                  <td>{studente.cognome}</td>
                  <td>{studente.linguaDaImparare}</td>
                  <td>{studente.livello}</td>
                  <td>{studente.eta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}

export default CourseList
