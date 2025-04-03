import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import apiClient from '../api/apiClient'
import AdminNavbar from '../components/AdminNavbar'
import CustomSpinner from '../components/CustomSpinner'
import ModaleInsegnante from '../components/ModaleInsegnante'
import { Button } from 'react-bootstrap'

const TeacherDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [insegnante, setInsegnante] = useState(null)
  const [tempInsegnante, setTempInsegnante] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [corsiAssegnati, setCorsiAssegnati] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      await Promise.all([fetchInsegnante(), fetchCorsiAssegnati()])
      setLoading(false)
    }
    fetchData()
  }, [])

  const fetchInsegnante = async () => {
    try {
      const response = await apiClient.get(`/insegnanti/${id}`)
      setInsegnante(response.data)
    } catch (error) {
      console.error('Errore nel recupero dell’insegnante', error)
      setError('Errore nel caricamento dell’insegnante.')
    } finally {
      setLoading(false)
    }
  }

  const fetchCorsiAssegnati = async () => {
    try {
      const response = await apiClient.get(`/corsi/insegnante/${id}`)
      setCorsiAssegnati(response.data)
    } catch (error) {
      console.error('Errore nel recupero dei corsi', error)
    }
  }

  const handleEdit = () => {
    setTempInsegnante({ ...insegnante })
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setTempInsegnante(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await apiClient.put(`/insegnanti/${id}`, tempInsegnante)
      alert('✅ Modifiche salvate con successo!')
      setInsegnante(tempInsegnante)
      setIsEditing(false)
    } catch (error) {
      console.error('Errore nella modifica dell’insegnante', error)
    }
  }

  const handleDelete = async () => {
    if (corsiAssegnati.length > 0) {
      alert(
        '⚠️ Questo insegnante ha ancora corsi attivi e non può essere eliminato.'
      )
      return
    }

    if (window.confirm('⚠️ Sei sicuro di voler eliminare questo insegnante?')) {
      try {
        await apiClient.delete(`/insegnanti/${id}`)
        navigate('/insegnanti')
      } catch (error) {
        console.error('Errore nella cancellazione dell’insegnante', error)
      }
    }
  }

  if (loading) return <CustomSpinner message="Caricamento insegnante..." />
  if (error) return <div className="alert alert-danger">{error}</div>
  if (!insegnante) return <p>⚠️ Nessun insegnante trovato.</p>

  return (
    <>
      <AdminNavbar />
      <div className="container pt-5 mt-5">
        <h2 className="text-center mb-4">👨‍🏫 Dettagli Insegnante</h2>

        <Button
          variant="secondary"
          onClick={() => navigate('/insegnanti')}
          className="mb-4"
        >
          🔙 Torna alla lista
        </Button>

        {!isEditing && (
          <div className="mb-4">
            <p>
              <strong>Nome:</strong> {insegnante.nome}
            </p>
            <p>
              <strong>Cognome:</strong> {insegnante.cognome}
            </p>
            <p>
              <strong>Email:</strong> {insegnante.email}
            </p>
            <p>
              <strong>Lingua:</strong> {insegnante.lingua}
            </p>
            <p>
              <strong>Giorni Disponibili:</strong>{' '}
              {(insegnante.giorniDisponibili || []).join(', ')}
            </p>
            <p>
              <strong>Fasce Orarie Disponibili:</strong>{' '}
              {(insegnante.fasceOrarieDisponibili || []).join(', ')}
            </p>
          </div>
        )}

        <div className="d-flex justify-content-between">
          {!isEditing ? (
            <Button variant="primary" onClick={handleEdit}>
              ✏️ Modifica
            </Button>
          ) : (
            <>
              <ModaleInsegnante
                show={isEditing}
                onHide={handleCancel}
                insegnante={tempInsegnante}
                setInsegnante={setTempInsegnante}
                onSubmit={handleSubmit}
              />
            </>
          )}

          <Button variant="danger" onClick={handleDelete}>
            🗑 Elimina
          </Button>
        </div>
      </div>
    </>
  )
}

export default TeacherDetail
