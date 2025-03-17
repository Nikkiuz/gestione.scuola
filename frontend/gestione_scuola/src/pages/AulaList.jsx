import { useEffect, useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import apiClient from '../api/apiClient'
import AdminNavbar from '../components/AdminNavbar'

const AulaList = () => {
  const [aule, setAule] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)

  // Stato per la nuova aula
  const [formData, setFormData] = useState({
    nome: '',
    capienzaMax: '',
    disponibilita: [],
  })

  useEffect(() => {
    fetchAule()
  }, [])

  const fetchAule = async () => {
    setLoading(true) // 🔄 Attiva il caricamento prima della richiesta

    try {
      const response = await apiClient.get('/aule') // ✅ Endpoint corretto
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
        await apiClient.delete(`/api/aule/${id}`)
        fetchAule()
      } catch (error) {
        console.error('Errore nella cancellazione dell’aula', error)
      }
    }
  }

  // 🔹 Gestisce il cambiamento degli input nel form
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }


  // 🔹 Invia il form per creare una nuova aula
const handleSubmit = async (e) => {
  e.preventDefault()
  setError('')

  // Trasforma l'array in una mappa (esempio: { "Lunedì": "", "Martedì": "" })
  const formattedData = {
    ...formData,
    disponibilita: formData.disponibilita.reduce((acc, giorno) => {
      acc[giorno] = "" // Il backend si aspetta un valore stringa, lascia vuoto per ora
      return acc
    }, {}),
  }

  console.log('📤 Dati inviati:', formattedData) // 🔍 Debug

  try {
    const response = await apiClient.post('/aule', formattedData)
    console.log('✅ Aula creata con successo:', response.data)

    setShowModal(false)
    fetchAule()
    alert('✅ Aula creata con successo!')
  } catch (error) {
    console.error('❌ Errore nella creazione dell’aula', error)
    setError(error.response ? JSON.stringify(error.response.data, null, 2) : 'Errore generico.')
  }
}


  return (
    <>
      <AdminNavbar />
      <div className="container mt-4">
        <h2 className="text-center mb-4">🏫 Lista Aule</h2>

        {/* 🔄 Mostra messaggio di caricamento */}
        {loading && <p className="text-center">⏳ Caricamento in corso...</p>}

        {/* ❌ Mostra eventuale errore */}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Pulsante per aprire il Modale di Aggiunta */}
        <button
          className="btn btn-success mb-3"
          onClick={() => setShowModal(true)}
        >
          ➕ Aggiungi Aula
        </button>

        {/* 🔹 Modale di Aggiunta Aula */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Aggiungi Aula</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {error && (
              <div className="alert alert-danger">
                <pre>{error}</pre> {/* Usa <pre> per formattare meglio JSON */}
              </div>
            )}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Nome Aula</Form.Label>
                <Form.Control
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Capienza Massima</Form.Label>
                <Form.Control
                  type="number"
                  name="capienzaMax"
                  value={formData.capienzaMax}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <div className="d-flex justify-content-end">
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Annulla
                </Button>
                <Button type="submit" variant="success" className="ms-2">
                  ✅ Aggiungi Aula
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

        {/* 🔹 Tabella Aule */}
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Capienza</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {aule.map((aula) => (
              <tr key={aula.id}>
                <td>{aula.nome}</td>
                <td>{aula.capienzaMax} studenti</td>
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
