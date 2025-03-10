import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/apiClient'
import AdminNavbar from '../components/AdminNavbar'

const TeacherList = () => {
  const [insegnanti, setInsegnanti] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchInsegnanti()
  }, [])

  // Recupera tutti gli insegnanti
  const fetchInsegnanti = async () => {
    try {
      const response = await apiClient.get('/insegnanti')
      setInsegnanti(response.data)
    } catch (error) {
      console.error('Errore nel recupero degli insegnanti', error)
      setError('Errore nel caricamento degli insegnanti.')
    } finally {
      setLoading(false)
    }
  }

  // Elimina un insegnante con doppia conferma
  const eliminaInsegnante = async (id) => {
    if (
      window.confirm(
        'Sei sicuro di voler eliminare questo insegnante? L’azione è irreversibile.'
      )
    ) {
      try {
        await apiClient.delete(`/insegnanti/${id}`)
        fetchInsegnanti() // Aggiorna la lista
      } catch (error) {
        console.error('Errore nell’eliminazione dell’insegnante', error)
      }
    }
  }

  return (
    <>
      <AdminNavbar />
      <div className="container mt-4">
        <h2 className="text-center mb-4">👨‍🏫 Gestione Insegnanti</h2>

        {/* Pulsante per aggiungere un nuovo insegnante */}
        <button
          className="btn btn-success mb-3"
          onClick={() => navigate('/insegnanti/nuovo')}
        >
          ➕ Aggiungi Insegnante
        </button>

        {loading ? (
          <p>Caricamento in corso...</p>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Giorni Disponibili</th>
                <th>Orari Disponibili</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {insegnanti.map((insegnante) => (
                <tr key={insegnante.id}>
                  <td>
                    {insegnante.nome} {insegnante.cognome}
                  </td>
                  <td>{insegnante.email}</td>
                  <td>{insegnante.giorniDisponibili.join(', ')}</td>
                  <td>{insegnante.fasceOrarieDisponibili.join(', ')}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => navigate(`/insegnanti/${insegnante.id}`)}
                    >
                      📄 Dettagli
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => eliminaInsegnante(insegnante.id)}
                    >
                      🗑 Elimina
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}

export default TeacherList
