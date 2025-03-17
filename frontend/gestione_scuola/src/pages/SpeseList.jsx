import { useEffect, useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/apiClient'
import AdminNavbar from '../components/AdminNavbar'

const SpeseList = () => {
  const [spese, setSpese] = useState([])
  const [categoria, setCategoria] = useState('') // 🔹 Ora vengono usati nei filtri
  const [mese, setMese] = useState('')
  const [loading, setLoading] = useState(true) // 🔹 Viene ora utilizzato
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate() // 🔹 Modale per aggiungere spesa
  const [formData, setFormData] = useState({
    categoria: '',
    importo: '',
    descrizione: '',
    dataSpesa: '',
  })

  useEffect(() => {
    fetchSpese()
  }, [])

  const fetchSpese = async () => {
    setLoading(true) // 🔄 Attiva il caricamento
    try {
      const response = await apiClient.get('/spese')
      setSpese(response.data)
    } catch (error) {
      console.error('Errore nel recupero delle spese', error)
      setError('Errore nel caricamento delle spese.')
    } finally {
      setLoading(false) // 🔄 Disattiva il caricamento
    }
  }

  const eliminaSpesa = async (id) => {
    if (window.confirm('Vuoi eliminare questa spesa?')) {
      try {
        await apiClient.delete(`/spese/${id}`)
        fetchSpese()
      } catch (error) {
        console.error('Errore nella cancellazione della spesa', error)
      }
    }
  }

  // 🔹 Gestisce il cambiamento degli input nel form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // 🔹 Invia il form per creare una nuova spesa
 const handleSubmit = async (e) => {
   e.preventDefault()
   setError('')

   console.log('📤 Dati inviati al backend:', formData) // 🔍 Debug

   try {
     const response = await apiClient.post('/spese', formData)
     console.log('✅ Spesa aggiunta con successo:', response.data)

     setShowModal(false) // Chiudi il modale
     fetchSpese() // Aggiorna la lista
     alert('✅ Spesa aggiunta con successo!')
   } catch (error) {
     console.error('❌ Errore nella creazione della spesa', error)
     if (error.response) {
       console.error('📩 Risposta dal server:', error.response.data) // 🔍 Debug della risposta
     }
     setError(
       error.response
         ? JSON.stringify(error.response.data, null, 2)
         : 'Errore generico.'
     )
   }
 }


  // 🔹 Filtra le spese per categoria e mese
  const speseFiltrate = spese.filter(
    (spesa) =>
      (!categoria || spesa.categoria === categoria) &&
      (!mese || spesa.dataSpesa.startsWith(mese))
  )

  return (
    <>
      <AdminNavbar />
      <div className="container mt-4">
        <h2 className="text-center mb-4">💰 Lista Spese</h2>

        {/* 🔄 Mostra messaggio di caricamento */}
        {loading && <p className="text-center">⏳ Caricamento in corso...</p>}

        {/* ❌ Mostra eventuale errore */}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Pulsante per aprire il Modale di Aggiunta */}
        <button
          className="btn btn-success mb-3"
          onClick={() => setShowModal(true)}
        >
          ➕ Aggiungi Spesa
        </button>

        {/* 🔹 Modale di Aggiunta Spesa */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Aggiungi Spesa</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {error && (
              <div className="alert alert-danger">
                <pre>{error}</pre>
              </div>
            )}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Categoria</Form.Label>
                <Form.Select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleziona una categoria</option>
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
                <Form.Label>Importo (€)</Form.Label>
                <Form.Control
                  type="number"
                  name="importo"
                  value={formData.importo}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Descrizione</Form.Label>
                <Form.Control
                  type="text"
                  name="descrizione"
                  value={formData.descrizione}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Data</Form.Label>
                <Form.Control
                  type="date"
                  name="dataSpesa"
                  value={formData.dataSpesa}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <div className="d-flex justify-content-end">
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Annulla
                </Button>
                <Button type="submit" variant="success" className="ms-2">
                  ✅ Aggiungi Spesa
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

        {/* 🔹 Filtro Spese */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Filtra per Categoria</label>
            <select
              className="form-select"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="">Tutte</option>
              <option value="BOLLETTE">Bollette</option>
              <option value="PULIZIA">Pulizia</option>
              <option value="MUTUO">Mutuo</option>
              <option value="CONTRIBUTI_INSEGNANTI">
                Contributi Insegnanti
              </option>
              <option value="CANCELLERIA">Cancelleria</option>
              <option value="COMMERCIALISTA">Commercialista</option>
              <option value="ALTRO">Altro</option>
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Filtra per Mese</label>
            <input
              type="month"
              className="form-control"
              value={mese}
              onChange={(e) => setMese(e.target.value)}
            />
          </div>
        </div>

        {/* 🔹 Tabella Spese */}
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Data</th>
              <th>Importo</th>
              <th>Categoria</th>
              <th>Descrizione</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {speseFiltrate.map((spesa) => (
              <tr key={spesa.id}>
                <td>{spesa.dataSpesa}</td>
                <td>€ {spesa.importo}</td>
                <td>{spesa.categoria}</td>
                <td>{spesa.descrizione}</td>
                <td>
                {/* 🔹 Pulsante per modificare */}
                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => navigate(`/spese/${spesa.id}`)}
                >
                  ✏️ Modifica
                </button>

                {/* 🔹 Pulsante per eliminare */}
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => eliminaSpesa(spesa.id)}
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

export default SpeseList
