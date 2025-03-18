import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import apiClient from '../api/apiClient'
import AdminNavbar from '../components/AdminNavbar'

const SpeseList = () => {
  const [spese, setSpese] = useState([])
  const [categoria, setCategoria] = useState('')
  const [mese, setMese] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  

  useEffect(() => {
    fetchSpese()
  }, [])

  const fetchSpese = async () => {
    try {
      const response = await apiClient.get('/spese')
      setSpese(response.data)
    } catch (error) {
      console.error('Errore nel recupero delle spese', error)
      setError('Errore nel caricamento delle spese.')
    } finally {
      setLoading(false)
    }
  }

  const eliminaSpesa = async (id) => {
    if (window.confirm('Vuoi eliminare questa spesa?')) {
      try {
        await apiClient.delete(`/spese/${id}`)
        fetchSpese()
      } catch (error) {
        console.error('Errore nella cancellazione della spesa', error)
      }
    }
  }

  const speseFiltrate = spese.filter(
    (spesa) =>
      (!categoria || spesa.categoria === categoria) &&
      (!mese || spesa.dataSpesa.startsWith(mese))
  )

  if (loading) return <p>Caricamento in corso...</p>
  if (error) return <div className="alert alert-danger">{error}</div>

  return (
    <>
      <AdminNavbar />
      <div className="container mt-4">
        <h2 className="text-center mb-4">💰 Lista Spese</h2>

        {/* Pulsante per aggiungere una nuova spesa */}
        <div className="mb-3 text-end">
          <Link to="/spese/nuova" className="btn btn-success">
            ➕ Aggiungi Spesa
          </Link>
        </div>

        {/* Filtri */}
        <div className="mb-3">
          <label className="form-label">Filtra per categoria</label>
          <select
            className="form-select"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="">Tutte</option>
            <option value="BOLLETTE">Bollette</option>
            <option value="PULIZIA">Pulizia</option>
            <option value="MUTUO">Mutuo</option>
            <option value="CONTRIBUTI_INSEGNANTI">Contributi Insegnanti</option>
            <option value="CANCELLERIA">Cancelleria</option>
            <option value="COMMERCIALISTA">Commercialista</option>
            <option value="ALTRO">Altro</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Filtra per mese</label>
          <input
            type="month"
            className="form-control"
            value={mese}
            onChange={(e) => setMese(e.target.value)}
          />
        </div>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>Data</th>
              <th>Importo</th>
              <th>Categoria</th>
              <th>Descrizione</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {speseFiltrate.map((spesa) => (
              <tr key={spesa.id}>
                <td>{spesa.dataSpesa}</td>
                <td>€ {spesa.importo}</td>
                <td>{spesa.categoria}</td>
                <td>{spesa.descrizione}</td>
                <td>
                  <Link
                    to={`/spese/${spesa.id}`}
                    className="btn btn-primary btn-sm me-2"
                  >
                    ✏️ Modifica
                  </Link>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => eliminaSpesa(spesa.id)}
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

export default SpeseList
