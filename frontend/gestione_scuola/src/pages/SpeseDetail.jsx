import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import apiClient from '../api/apiClient'
import AdminNavbar from '../components/AdminNavbar'
import { Button } from 'react-bootstrap'
import ModaleSpesa from '../components/ModaleSpesa'

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

  // ✅ Elimina la spesa
  const eliminaSpesa = async () => {
    if (window.confirm('⚠️ Sei sicuro di voler eliminare questa spesa?')) {
      try {
      await apiClient.delete(`/spese/${id}`)
      alert('✅ Spesa eliminata con successo!')
      sessionStorage.setItem('refreshReport', 'true')

      } catch (error) {
        console.error('❌ Errore nell’eliminazione della spesa', error)
      }
    }
  }

  if (loading) return <p>⏳ Caricamento in corso...</p>
  if (error) return <div className="alert alert-danger">{error}</div>
  if (!spesa) return <p>⚠️ Nessuna spesa trovata.</p>


return (
  <>
    <AdminNavbar />
    <div className="container mt-4">
      <h2 className="text-center mb-4">💰 Dettagli Spesa</h2>

      <div className="card p-3 shadow">
        <p>
          <strong>Importo:</strong> € {spesa.importo}
        </p>
        <p>
          <strong>Categoria:</strong> {spesa.categoria}
        </p>
        <p>
          <strong>Descrizione:</strong> {spesa.descrizione}
        </p>
        <p>
          <strong>Data:</strong> {spesa.dataSpesa}
        </p>

        <div className="d-flex justify-content-between">
          <Button variant="primary" onClick={handleEdit}>
            ✏️ Modifica Spesa
          </Button>

          <Button variant="danger" onClick={eliminaSpesa}>
            🗑 Elimina Spesa
          </Button>
        </div>
      </div>

      <Button
        className="btn btn-secondary mt-3"
        onClick={() => navigate('/spese')}
      >
        🔙 Torna alla lista
      </Button>

      {/* 🔹 Modale per la modifica */}
      <ModaleSpesa
        show={isEditing}
        onHide={() => setIsEditing(false)}
        formData={tempSpesa}
        setFormData={setTempSpesa}
        isEditing={true}
        handleSubmit={async (e) => {
          e.preventDefault()
          try {
            await apiClient.put(`/spese/${id}`, {
              ...tempSpesa,
              dataSpesa: new Date(tempSpesa.dataSpesa)
                .toISOString()
                .split('T')[0],
            })
            alert('✅ Modifica salvata con successo!')
            setSpesa(tempSpesa)
            setIsEditing(false)
            sessionStorage.setItem('refreshReport', 'true')
          } catch (error) {
            console.error('❌ Errore nella modifica della spesa:', error)
            alert('Errore durante il salvataggio.')
          }
        }}
      />
    </div>
  </>
)
}

export default SpeseDetail
