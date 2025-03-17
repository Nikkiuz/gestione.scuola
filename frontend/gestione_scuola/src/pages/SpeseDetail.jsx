import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import apiClient from '../api/apiClient'
import AdminNavbar from '../components/AdminNavbar'
import { Form, Button } from 'react-bootstrap'

const SpeseDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [spesa, setSpesa] = useState(null)
  const [tempSpesa, setTempSpesa] = useState(null) // 🔹 Stato temporaneo per la modifica
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    fetchSpesa()
  }, [])

  const fetchSpesa = async () => {
    try {
      const response = await apiClient.get(`/spese/${id}`)
      setSpesa(response.data)
      setTempSpesa(response.data) // 🔹 Inizializza lo stato temporaneo
    } catch (error) {
      console.error('❌ Errore nel recupero della spesa', error)
      setError('Errore nel caricamento della spesa.')
    } finally {
      setLoading(false)
    }
  }

  // ✅ Attiva la modalità modifica e clona i dati
  const handleEdit = () => {
    setTempSpesa({ ...spesa }) // Clona i dati per modifiche sicure
    setIsEditing(true)
  }

  // ✅ Modifica i valori dei campi
  const handleChange = (e) => {
    setTempSpesa((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  // ✅ Salva le modifiche e aggiorna lo stato originale
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await apiClient.put(`/spese/${id}`, tempSpesa)
      alert('✅ Modifiche salvate con successo!')
      setSpesa(tempSpesa) // 🔹 Aggiorna i dati originali con quelli modificati
      setIsEditing(false) // 🔹 Disattiva la modalità modifica
    } catch (error) {
      console.error('❌ Errore nella modifica della spesa', error)
    }
  }

  // ✅ Annulla le modifiche
  const handleCancel = () => {
    setIsEditing(false)
    setTempSpesa(null) // Resetta i dati temporanei
  }

  // ✅ Elimina la spesa
  const eliminaSpesa = async () => {
    if (window.confirm('⚠️ Sei sicuro di voler eliminare questa spesa?')) {
      try {
        await apiClient.delete(`/spese/${id}`)
        navigate('/spese')
      } catch (error) {
        console.error('❌ Errore nell’eliminazione della spesa', error)
      }
    }
  }

  if (loading) return <p>⏳ Caricamento in corso...</p>
  if (error) return <div className="alert alert-danger">{error}</div>
  if (!spesa) return <p>⚠️ Nessuna spesa trovata.</p>

  const dati = isEditing ? tempSpesa : spesa // 🔹 Usa i dati giusti

  return (
    <>
      <AdminNavbar />
      <div className="container mt-4">
        <h2 className="text-center mb-4">💰 Dettagli Spesa</h2>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Importo</Form.Label>
            <Form.Control
              type="number"
              name="importo"
              value={dati?.importo || ''}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Categoria</Form.Label>
            <Form.Select
              name="categoria"
              value={dati?.categoria || ''}
              onChange={handleChange}
              disabled={!isEditing}
            >
              <option value="BOLLETTE">Bollette</option>
              <option value="PULIZIA">Pulizia</option>
              <option value="MUTUO">Mutuo</option>
              <option value="CONTRIBUTI_INSEGNANTI">
                Contributi Insegnanti
              </option>
              <option value="CANCELLERIA">Cancelleria</option>
              <option value="COMMERCIALISTA">Commercialista</option>
              <option value="ALTRO">Altro</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descrizione</Form.Label>
            <Form.Control
              type="text"
              name="descrizione"
              value={dati?.descrizione || ''}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Data</Form.Label>
            <Form.Control
              type="date"
              name="dataSpesa"
              value={dati?.dataSpesa || ''}
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

            <Button variant="danger" onClick={eliminaSpesa}>
              🗑 Elimina
            </Button>
          </div>
        </Form>

        <Button
          className="btn btn-secondary mt-3"
          onClick={() => navigate('/spese')}
        >
          🔙 Torna alla lista
        </Button>
      </div>
    </>
  )
}

export default SpeseDetail
