import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/apiClient'
import AdminNavbar from '../components/AdminNavbar'
import CustomSpinner from '../components/CustomSpinner'
import ModaleInsegnante from '../components/ModaleInsegnante'

const TeacherList = () => {
  const [insegnanti, setInsegnanti] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [formInsegnante, setFormInsegnante] = useState({
    nome: '',
    cognome: '',
    email: '',
    lingua: '',
    giorniDisponibili: [],
    fasceOrarieDisponibili: [],
  })
  const navigate = useNavigate()

  useEffect(() => {
    fetchInsegnanti()
  }, [])

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

  const creaInsegnante = async (e) => {
    e.preventDefault()
    try {
      await apiClient.post('/insegnanti', formInsegnante)
      alert('✅ Insegnante aggiunto con successo!')
      setShowModal(false)
      setFormInsegnante({
        nome: '',
        cognome: '',
        email: '',
        lingua: '',
        giorniDisponibili: [],
        fasceOrarieDisponibili: [],
      })
      fetchInsegnanti()
    } catch (error) {
      console.error('Errore nella creazione dell’insegnante', error)
      alert('❌ Errore durante la creazione dell’insegnante.')
    }
  }

  const eliminaInsegnante = async (id) => {
    if (
      window.confirm(
        'Sei sicuro di voler eliminare questo insegnante? L’azione è irreversibile.'
      )
    ) {
      try {
        await apiClient.delete(`/insegnanti/${id}`)
        fetchInsegnanti()
      } catch (error) {
        console.error('Errore nell’eliminazione dell’insegnante', error)
      }
    }
  }

  return (
    <>
      <AdminNavbar />
      <div className="container pt-5 mt-5">
        <h2 className="text-center mb-4">👨‍🏫 Gestione Insegnanti</h2>

        <div className="text-start mb-3">
          <button
            className="btn btn-success"
            onClick={() => setShowModal(true)}
          >
            ➕ Aggiungi Insegnante
          </button>
        </div>

        <ModaleInsegnante
          show={showModal}
          onHide={() => setShowModal(false)}
          onSubmit={creaInsegnante}
          insegnante={formInsegnante}
          setInsegnante={setFormInsegnante}
          modalTitle="Aggiungi Insegnante"
        />

        {loading && <CustomSpinner message="Caricamento insegnanti..." />}
        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && (
          <div className="table-responsive-wrapper">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Cognome</th>
                  <th>Email</th>
                  <th>Lingua</th>
                  <th>Azioni</th>
                </tr>
              </thead>
              <tbody>
                {insegnanti.map((insegnante) => (
                  <tr key={insegnante.id}>
                    <td>{insegnante.nome}</td>
                    <td>{insegnante.cognome}</td>
                    <td>{insegnante.email}</td>
                    <td>{insegnante.lingua}</td>
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
          </div>
        )}
      </div>
    </>
  )
}

export default TeacherList
