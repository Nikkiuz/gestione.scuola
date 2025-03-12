import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import apiClient from '../api/apiClient'

const TeacherProfile = () => {
  const { user } = useSelector((state) => state.auth) // Utente loggato
  const [teacherData, setTeacherData] = useState(null)
  const [formData, setFormData] = useState({})
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (user) {
      fetchTeacherData(user.id)
    }
  }, [user])

  // Recupera i dati dell'entità Insegnante associata all'utente
  const fetchTeacherData = async (userId) => {
    try {
      const response = await apiClient.get(`/insegnanti/user/${userId}`)
      setTeacherData(response.data)
      setFormData(response.data) // Inizializza il form con i dati attuali
    } catch (error) {
      console.error('Errore nel recupero dei dati', error)
      setErrorMessage('Errore nel caricamento del profilo.')
    }
  }

  // Gestione input: aggiorna solo i campi modificati
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Invia solo i dati modificati
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccessMessage('')
    setErrorMessage('')
    try {
      await apiClient.put(`/insegnanti/${teacherData.id}`, formData)
      setSuccessMessage('Dati aggiornati con successo!')
    } catch (error) {
      console.error('Errore aggiornamento profilo', error)
      setErrorMessage('Errore durante l’aggiornamento dei dati.')
    }
  }

  if (!teacherData) {
    return <p>Caricamento dati...</p>
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">👤 Il Mio Profilo</h2>
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nome</label>
          <input
            type="text"
            className="form-control"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Cognome</label>
          <input
            type="text"
            className="form-control"
            name="cognome"
            value={formData.cognome}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Telefono</label>
          <input
            type="text"
            className="form-control"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Salva Modifiche
        </button>
      </form>
    </div>
  )
}

export default TeacherProfile
