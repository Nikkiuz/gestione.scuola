import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import apiClient from '../api/apiClient'
import AdminNavbar from '../components/AdminNavbar'

const AulaList = () => {
  const [aule, setAule] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAule()
  }, [])

  const fetchAule = async () => {
    try {
      const response = await apiClient.get('/aule')
      setAule(response.data)
    } catch (error) {
      console.error('Errore nel recupero delle aule', error)
      setError('Errore nel caricamento delle aule.')
    } finally {
      setLoading(false)
    }
  }

  const eliminaAula = async (id) => {
    if (window.confirm('Vuoi eliminare questa aula?')) {
      try {
        await apiClient.delete(`/aule/${id}`)
        fetchAule()
      } catch (error) {
        console.error('Errore nella cancellazione dell’aula', error)
      }
    }
  }

  if (loading) return <p>Caricamento in corso...</p>
  if (error) return <div className="alert alert-danger">{error}</div>

  return (
    <>
      <AdminNavbar />
      <div className="container mt-4">
        <h2 className="text-center mb-4">🏫 Lista Aule</h2>

        {/* Pulsante per aggiungere una nuova aula */}
        <div className="mb-3">
          <Link to="/aule/nuova" className="btn btn-success">
            ➕ Aggiungi Aula
          </Link>
        </div>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Capienza</th>
              <th>Disponibilità</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {aule.map((aula) => (
              <tr key={aula.id}>
                <td>{aula.nome}</td>
                <td>{aula.capienzaMax} studenti</td>
                <td>Giorni: {Object.keys(aula.disponibilita).join(', ')}</td>
                <td>
                  <Link
                    to={`/aule/${aula.id}`}
                    className="btn btn-primary btn-sm me-2"
                  >
                    ✏️ Modifica
                  </Link>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => eliminaAula(aula.id)}
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

export default AulaList
