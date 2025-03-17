import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import apiClient from '../api/apiClient'
import AdminNavbar from '../components/AdminNavbar'
import { Form, Button } from 'react-bootstrap'

const AulaDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [aula, setAula] = useState(null)
  const [tempAula, setTempAula] = useState(null) // 🔹 Stato temporaneo per la modifica
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    fetchAula()
  }, [])

  const fetchAula = async () => {
    try {
      const response = await apiClient.get(`/aule/${id}`)
      setAula(response.data)
      setTempAula(response.data) // 🔹 Inizializza lo stato temporaneo
    } catch (error) {
      console.error('❌ Errore nel recupero dell’aula', error)
      setError('Errore nel caricamento dell’aula.')
    } finally {
      setLoading(false)
    }
  }

  // ✅ Attiva la modalità modifica e clona i dati
  const handleEdit = () => {
    setTempAula({ ...aula }) // Clona i dati per modifiche sicure
    setIsEditing(true)
  }

  // ✅ Modifica i valori dei campi
  const handleChange = (e) => {
    setTempAula((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  // ✅ Salva le modifiche e aggiorna lo stato originale
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await apiClient.put(`/aule/${id}`, tempAula)
      alert('✅ Modifiche salvate con successo!')
      setAula(tempAula) // 🔹 Aggiorna i dati originali con quelli modificati
      setIsEditing(false) // 🔹 Disattiva la modalità modifica
    } catch (error) {
      console.error('❌ Errore nella modifica dell’aula', error)
    }
  }

  // ✅ Annulla le modifiche
  const handleCancel = () => {
    setIsEditing(false)
    setTempAula(null) // Resetta i dati temporanei
  }

  // ✅ Elimina l’aula
  const eliminaAula = async () => {
    if (window.confirm('⚠️ Sei sicuro di voler eliminare questa aula?')) {
      try {
        await apiClient.delete(`/aule/${id}`)
        navigate('/aule')
      } catch (error) {
        console.error('❌ Errore nell’eliminazione dell’aula', error)
      }
    }
  }

  if (loading) return <p>⏳ Caricamento in corso...</p>
  if (error) return <div className="alert alert-danger">{error}</div>
  if (!aula) return <p>⚠️ Nessuna aula trovata.</p>

  const dati = isEditing ? tempAula : aula // 🔹 Usa i dati giusti

  return (
    <>
      <AdminNavbar />
      <div className="container mt-4">
        <h2 className="text-center mb-4">🏫 Dettagli Aula</h2>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              name="nome"
              value={dati?.nome || ''}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Capienza Massima</Form.Label>
            <Form.Control
              type="number"
              name="capienzaMax"
              value={dati?.capienzaMax || ''}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </Form.Group>


          {/* Pulsanti di Azione */}
          <div className="d-flex justify-content-between">
            {!isEditing ? (
              <Button variant="primary" type="button" onClick={handleEdit}>
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

            <Button variant="danger" onClick={eliminaAula}>
              🗑 Elimina
            </Button>
          </div>
        </Form>

        <Button
          className="btn btn-secondary mt-3"
          onClick={() => navigate('/aule')}
        >
          🔙 Torna alla lista
        </Button>
      </div>
    </>
  )
}

export default AulaDetail
