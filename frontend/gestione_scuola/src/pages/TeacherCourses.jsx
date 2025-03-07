import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/apiClient'

const TeacherCourses = () => {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [corsi, setCorsi] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user || user.role !== 'INSEGNANTE') {
      navigate('/login')
    } else {
      fetchCorsi()
    }
  }, [user, navigate])

  // 🔹 Recupera corsi dell'insegnante
  const fetchCorsi = async () => {
    try {
      const response = await apiClient.get(`/insegnanti/${user.id}/corsi`)
      setCorsi(response.data)
    } catch (error) {
      console.error('Errore nel recupero dei corsi', error)
      setError('Errore nel caricamento dei corsi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">📚 I Miei Corsi</h2>

      {loading ? (
        <p>Caricamento...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : corsi.length === 0 ? (
        <div className="alert alert-warning">Non hai corsi assegnati.</div>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Lingua</th>
              <th>Livello</th>
              <th>Giorno</th>
              <th>Orario</th>
              <th>Frequenza</th>
              <th>Studenti</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {corsi.map((corso) => (
              <tr key={corso.id}>
                <td>{corso.lingua}</td>
                <td>{corso.livello}</td>
                <td>{corso.giorno}</td>
                <td>{corso.orario}</td>
                <td>{corso.frequenza}</td>
                <td>{corso.studenti.length}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => navigate(`/corsi/${corso.id}`)}
                  >
                    📖 Dettagli
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default TeacherCourses
