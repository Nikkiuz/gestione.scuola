import { useEffect, useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import apiClient from '../api/apiClient'
import AdminNavbar from '../components/AdminNavbar'

const AulaList = () => {
  const [aule, setAule] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingAula, setEditingAula] = useState(null) // Stato per l'aula in modifica

  // Stato per la nuova aula
  const [formData, setFormData] = useState({
    nome: '',
    capienzaMax: '',
    disponibilita: [],
  })

  // Funzione per resettare il form
  const resetFormData = () => {
    setFormData({
      nome: '',
      capienzaMax: '',
      disponibilita: [],
    })
  }

  useEffect(() => {
    fetchAule()
  }, [])

  const fetchAule = async () => {
    setLoading(true)

    try {
      const response = await apiClient.get('/aule')
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
        await apiClient.delete(`/aule/${id}`)
        fetchAule()
      } catch (error) {
        console.error('Errore nella cancellazione dell’aula', error)
      }
    }
  }

  // Gestisce il cambiamento degli input nel form
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // Invia il form per creare una nuova aula
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const formattedData = {
      ...formData,
      disponibilita: formData.disponibilita.reduce((acc, giorno) => {
        acc[giorno] = ''
        return acc
      }, {}),
    }

    try {
      const response = await apiClient.post('/aule', formattedData)
      console.log('Risposta del backend:', response.data)
      setShowAddModal(false)
      resetFormData() // Resetta il form
      fetchAule()
      alert('✅ Aula creata con successo!')
    } catch (error) {
      console.error('❌ Errore nella creazione dell’aula', error)
      setError(
        error.response
          ? JSON.stringify(error.response.data, null, 2)
          : 'Errore generico.'
      )
    }
  }

  // Apre il modale di modifica con i dati dell'aula selezionata
  const handleEdit = (aula) => {
    setEditingAula(aula)
    setShowEditModal(true)
  }

  // Salva le modifiche dell'aula
  const handleEditSubmit = async (e) => {
    e.preventDefault()
    try {
      await apiClient.put(`/aule/${editingAula.id}`, editingAula)
      setShowEditModal(false)
      fetchAule()
      alert('✅ Modifiche salvate con successo!')
    } catch (error) {
      console.error('❌ Errore nella modifica dell’aula', error)
    }
  }

  return (
    <>
      <AdminNavbar />
      <div className="container pt-5 mt-5">
        <h2 className="text-center mb-4">🏫 Lista Aule</h2>

        {loading && <p className="text-center">⏳ Caricamento in corso...</p>}
        {error && <div className="alert alert-danger">{error}</div>}

        <button
          className="btn btn-success mb-3"
          onClick={() => setShowAddModal(true)}
        >
          ➕ Aggiungi Aula
        </button>

        {/* Modale per aggiungere un'aula */}
        <Modal
          show={showAddModal}
          onHide={() => {
            setShowAddModal(false)
            resetFormData()
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Aggiungi Aula</Modal.Title>
          </Modal.Header>
          <Modal.Body>
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
                <Button
                  variant="secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Annulla
                </Button>
                <Button type="submit" variant="success" className="ms-2">
                  ✅ Aggiungi Aula
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Modale per modificare un'aula */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Modifica Aula</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleEditSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Nome Aula</Form.Label>
                <Form.Control
                  type="text"
                  name="nome"
                  value={editingAula?.nome || ''}
                  onChange={(e) =>
                    setEditingAula({ ...editingAula, nome: e.target.value })
                  }
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Capienza Massima</Form.Label>
                <Form.Control
                  type="number"
                  name="capienzaMax"
                  value={editingAula?.capienzaMax || ''}
                  onChange={(e) =>
                    setEditingAula({
                      ...editingAula,
                      capienzaMax: e.target.value,
                    })
                  }
                  required
                />
              </Form.Group>

              <div className="d-flex justify-content-end">
                <Button
                  variant="secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Annulla
                </Button>
                <Button type="submit" variant="success" className="ms-2">
                  💾 Salva Modifiche
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Tabella Aule */}
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
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => handleEdit(aula)}
                  >
                    ✏️ Modifica
                  </button>
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
