import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/apiClient'
import AdminNavbar from '../components/AdminNavbar'
import { Modal, Button, Form } from 'react-bootstrap'

const TeacherList = () => {
  const [insegnanti, setInsegnanti] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false) // 🔹 Stato per il modale
  const navigate = useNavigate()

  // Stato per il form di aggiunta insegnante
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    email: '',
    lingua: '',
    giorniDisponibili: [],
    fasceOrarieDisponibili: [],
  })

  useEffect(() => {
    fetchInsegnanti()
  }, [])

  // Recupera tutti gli insegnanti
  const fetchInsegnanti = async () => {
    try {
      const response = await apiClient.get('/insegnanti', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      setInsegnanti(response.data)
    } catch (error) {
      console.error('Errore nel recupero degli insegnanti', error)
      setError('Errore nel caricamento degli insegnanti.')
    } finally {
      setLoading(false)
    }
  }

  // ✅ Gestisce il cambiamento nei campi del form
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // ✅ Gestisce le checkbox per i giorni disponibili
  const handleGiorniDisponibiliChange = (e) => {
    const { value, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      giorniDisponibili: checked
        ? [...prev.giorniDisponibili, value]
        : prev.giorniDisponibili.filter((g) => g !== value),
    }))
  }

  // ✅ Gestisce le checkbox per le fasce orarie disponibili
  const handleFasceOrarieChange = (e) => {
    const { value, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      fasceOrarieDisponibili: checked
        ? [...prev.fasceOrarieDisponibili, value]
        : prev.fasceOrarieDisponibili.filter((f) => f !== value),
    }))
  }

  // ✅ Invia il form per aggiungere un nuovo insegnante
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await apiClient.post('/insegnanti', formData)
      setShowModal(false)
      fetchInsegnanti()
    } catch (error) {
      console.error('Errore nella creazione dell’insegnante', error)
    }
  }

  // 🔹 Elimina un insegnante con doppia conferma
  const eliminaInsegnante = async (id) => {
    if (
      window.confirm(
        'Sei sicuro di voler eliminare questo insegnante? L’azione è irreversibile.'
      )
    ) {
      try {
        await apiClient.delete(`/api/insegnanti/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        fetchInsegnanti() // 🔄 Aggiorna la lista dopo l'eliminazione
      } catch (error) {
        console.error('Errore nell’eliminazione dell’insegnante', error)
      }
    }
  }
  
  return (
    <>
      <AdminNavbar />
      <div className="container mt-4">
        <h2 className="text-center mb-4">👨‍🏫 Gestione Insegnanti</h2>

        {/* Pulsante per aprire il modale */}
        <div className="text-end mb-3">
          <button
            className="btn btn-success"
            onClick={() => setShowModal(true)}
          >
            ➕ Aggiungi Insegnante
          </button>
        </div>

        {/* 🔹 MODALE PER AGGIUNGERE INSEGNANTE */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Aggiungi Insegnante</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Cognome</Form.Label>
                <Form.Control
                  type="text"
                  name="cognome"
                  value={formData.cognome}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Lingua</Form.Label>
                <Form.Control
                  type="text"
                  name="lingua"
                  value={formData.lingua}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              {/* Giorni disponibili - checkbox multiple */}
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
                        checked={formData.giorniDisponibili.includes(giorno)}
                        onChange={handleGiorniDisponibiliChange}
                        className="me-3"
                      />
                    )
                  )}
                </div>
              </Form.Group>

              {/* Fasce orarie disponibili - checkbox multiple */}
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
                      checked={formData.fasceOrarieDisponibili.includes(fascia)}
                      onChange={handleFasceOrarieChange}
                      className="me-3"
                    />
                  ))}
                </div>
              </Form.Group>

              <div className="d-flex justify-content-end">
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Annulla
                </Button>
                <Button type="submit" variant="success" className="ms-2">
                  ✅ Aggiungi
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

        {/* 🔎 Mostra messaggio di caricamento o errore */}
        {loading && <p>⏳ Caricamento in corso...</p>}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* 📌 Tabella Insegnanti */}
        {!loading && !error && (
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
        )}
      </div>
    </>
  )
}

export default TeacherList