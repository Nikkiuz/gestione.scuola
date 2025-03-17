import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import apiClient from '../api/apiClient'
import AdminNavbar from '../components/AdminNavbar'
import { Form, Button } from 'react-bootstrap'

const TeacherDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [insegnante, setInsegnante] = useState(null)
  const [tempInsegnante, setTempInsegnante] = useState(null) // 🔹 Stato temporaneo per la modifica
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [corsiAssegnati, setCorsiAssegnati] = useState([])

  useEffect(() => {
    fetchInsegnante()
    fetchCorsiAssegnati()
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

  // ✅ Attiva la modalità modifica e clona i dati
  const handleEdit = () => {
    setTempInsegnante({ ...insegnante }) // Clona i dati per modifiche sicure
    setIsEditing(true)
  }

  // ✅ Aggiorna il valore nello stato temporaneo
  const handleChange = (e) => {
    setTempInsegnante((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  // ✅ Gestisce i checkbox multipli
  const handleCheckboxChange = (e, key) => {
    const { value, checked } = e.target
    setTempInsegnante((prev) => ({
      ...prev,
      [key]: checked
        ? [...(prev[key] || []), value] // Seleziona valore
        : (prev[key] || []).filter((item) => item !== value), // Rimuove valore
    }))
  }

  // ✅ Salva le modifiche e aggiorna lo stato originale
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await apiClient.put(`/insegnanti/${id}`, tempInsegnante)
      alert('✅ Modifiche salvate con successo!')
      setInsegnante(tempInsegnante) // 🔹 Aggiorna i dati originali con quelli modificati
      setIsEditing(false) // 🔹 Disattiva la modalità modifica
    } catch (error) {
      console.error('Errore nella modifica dell’insegnante', error)
    }
  }

  // ✅ Annulla le modifiche
  const handleCancel = () => {
    setIsEditing(false)
    setTempInsegnante(null) // Resetta i dati temporanei
  }

  // ✅ Elimina l’insegnante (solo se non ha corsi attivi)
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
        navigate('/insegnanti') // 🔹 Ritorna alla lista dopo la cancellazione
      } catch (error) {
        console.error('Errore nella cancellazione dell’insegnante', error)
      }
    }
  }

  if (loading) return <p>Caricamento in corso...</p>
  if (error) return <div className="alert alert-danger">{error}</div>
  if (!insegnante) return <p>⚠️ Nessun insegnante trovato.</p>

  const dati = isEditing ? tempInsegnante : insegnante // 🔹 Usa i dati giusti

  return (
    <>
      <AdminNavbar />
      <div className="container mt-4">
        <h2 className="text-center mb-4">👨‍🏫 Dettagli Insegnante</h2>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              name="nome"
              value={dati.nome}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Cognome</Form.Label>
            <Form.Control
              type="text"
              name="cognome"
              value={dati.cognome}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={dati.email}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Lingua</Form.Label>
            <Form.Control
              type="text"
              name="lingua"
              value={dati.lingua}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </Form.Group>

          {/* Giorni Disponibili - Checkbox */}
          <Form.Group className="mb-3">
            <Form.Label>Giorni Disponibili</Form.Label>
            <div className="d-flex flex-wrap">
              {['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì'].map(
                (giorno) => (
                  <Form.Check
                    key={giorno}
                    type="checkbox"
                    label={giorno}
                    value={giorno}
                    checked={(dati.giorniDisponibili || []).includes(giorno)}
                    onChange={(e) =>
                      handleCheckboxChange(e, 'giorniDisponibili')
                    }
                    disabled={!isEditing}
                    className="me-3"
                  />
                )
              )}
            </div>
          </Form.Group>

          {/* Fasce Orarie Disponibili - Checkbox */}
          <Form.Group className="mb-3">
            <Form.Label>Fasce Orarie Disponibili</Form.Label>
            <div className="d-flex flex-wrap">
              {[
                '08:00-10:00',
                '10:00-12:00',
                '12:00-14:00',
                '14:00-16:00',
                '16:00-18:00',
                '18:00-20:00',
              ].map((fascia) => (
                <Form.Check
                  key={fascia}
                  type="checkbox"
                  label={fascia}
                  value={fascia}
                  checked={(dati.fasceOrarieDisponibili || []).includes(fascia)}
                  onChange={(e) =>
                    handleCheckboxChange(e, 'fasceOrarieDisponibili')
                  }
                  disabled={!isEditing}
                  className="me-3"
                />
              ))}
            </div>
          </Form.Group>

          {/* Pulsanti di Azione */}
          <div className="d-flex justify-content-between">
            {!isEditing ? (
              <Button variant="primary" onClick={handleEdit}>
                ✏️ Modifica
              </Button>
            ) : (
              <>
                <Button type="submit" variant="success">
                  💾 Salva Modifiche
                </Button>
                <Button
                  variant="secondary"
                  className="ms-2"
                  onClick={handleCancel}
                >
                  ❌ Annulla
                </Button>
              </>
            )}

            <Button variant="danger" onClick={handleDelete}>
              🗑 Elimina
            </Button>
          </div>
        </Form>
      </div>
    </>
  )
}

export default TeacherDetail
