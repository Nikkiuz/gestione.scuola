import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/apiClient'
import AdminNavbar from '../components/AdminNavbar'
import { Modal, Button, Form } from 'react-bootstrap'

const StudentList = () => {
  const [studenti, setStudenti] = useState([])
  const [studentiSenzaCorso, setStudentiSenzaCorso] = useState([])
  const [insegnanti, setInsegnanti] = useState([])
  const [filtroNome, setFiltroNome] = useState('')
  const [filtroCognome, setFiltroCognome] = useState('')
  const [filtroLivello, setFiltroLivello] = useState('')
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    eta: '',
    linguaDaImparare: '',
    livello: '',
    tipologiaIscrizione: '',
    giorniPreferiti: [],
    fasceOrariePreferite: [],
    corsoPrivato: false,
    frequenzaCorsoPrivato: 1,
    tipoCorsoGruppo: '1 volta a settimana',
    insegnanteId: '',
  })

  useEffect(() => {
    fetchStudenti()
    fetchInsegnanti()
  }, [])

 const fetchStudenti = async () => {
   try {
     const response = await apiClient.get('/studenti')

     if (!response.data || !Array.isArray(response.data)) {
       console.error(
         '❌ Errore: response.data non è un array valido',
         response.data
       )
       return
     }

     setStudenti(response.data.filter((s) => s.corsi?.length > 0))
     setStudentiSenzaCorso(
       response.data.filter((s) => !s.corsi || s.corsi.length === 0)
     )
   } catch (error) {
     console.error('❌ Errore nel recupero degli studenti:', error)
   }
 }


  const fetchInsegnanti = async () => {
    try {
      const response = await apiClient.get('/insegnanti')
      setInsegnanti(response.data)
    } catch (error) {
      console.error('Errore nel recupero degli insegnanti', error)
    }
  }

  const filtraStudenti = (lista) => {
    return lista.filter(
      (s) =>
        s.nome.toLowerCase().includes(filtroNome.toLowerCase()) &&
        s.cognome.toLowerCase().includes(filtroCognome.toLowerCase()) &&
        s.livello.toLowerCase().includes(filtroLivello.toLowerCase())
    )
  }

  const eliminaStudente = async (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questo studente?')) {
      try {
        await apiClient.delete(`/studenti/${id}`)
        fetchStudenti()
      } catch (error) {
        console.error('Errore nell’eliminazione dello studente', error)
      }
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
  }

const handleSubmit = async (e) => {
  e.preventDefault()
  try {
    const response = await apiClient.post('/studenti', formData)
    console.log('✅ Studente aggiunto con successo:', response.data)

    alert('✅ Studente aggiunto correttamente!') // Mostra un alert
    setShowModal(false) // Chiudi il modale
    fetchStudenti() // Aggiorna la lista degli studenti
  } catch (error) {
    console.error('❌ Errore nella creazione dello studente', error)
  }
}



  return (
    <>
      <AdminNavbar />
      <div className="container mt-4">
        <h2 className="text-center mb-4">🎓 Gestione Studenti</h2>

        <button
          className="btn btn-success mb-3"
          onClick={() => setShowModal(true)}
        >
          ➕ Aggiungi Studente
        </button>

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Aggiungi Studente</Modal.Title>
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

              {/* Età */}
              <Form.Group className="mb-3">
                <Form.Label>Età</Form.Label>
                <Form.Control
                  type="number"
                  name="eta"
                  value={formData.eta}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              {/* Lingua da imparare */}
              <Form.Group className="mb-3">
                <Form.Label>Lingua da imparare</Form.Label>
                <Form.Control
                  type="text"
                  name="linguaDaImparare"
                  value={formData.linguaDaImparare}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              {/* Livello iniziale */}
              <Form.Group className="mb-3">
                <Form.Label>Livello Iniziale</Form.Label>
                <Form.Control
                  type="text"
                  name="livello"
                  value={formData.livello}
                  onChange={handleChange}
                  placeholder="Lascia vuoto se non disponibile"
                />
              </Form.Group>

              {/* Tipologia di iscrizione */}
              <Form.Group className="mb-3">
                <Form.Label>Tipologia di Iscrizione</Form.Label>
                <Form.Control
                  type="text"
                  name="tipologiaIscrizione"
                  value={formData.tipologiaIscrizione}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Giorni Preferiti</Form.Label>
                <div className="d-flex flex-wrap">
                  {['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì'].map(
                    (giorno) => (
                      <Form.Check
                        key={giorno}
                        type="checkbox"
                        label={giorno}
                        value={giorno}
                        checked={formData.giorniPreferiti.includes(giorno)}
                        onChange={(e) => {
                          const { value, checked } = e.target
                          setFormData((prev) => ({
                            ...prev,
                            giorniPreferiti: checked
                              ? [...prev.giorniPreferiti, value]
                              : prev.giorniPreferiti.filter((g) => g !== value),
                          }))
                        }}
                        className="me-3"
                      />
                    )
                  )}
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Fasce Orarie Preferite</Form.Label>
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
                      checked={formData.fasceOrariePreferite.includes(fascia)}
                      onChange={(e) => {
                        const { value, checked } = e.target
                        setFormData((prev) => ({
                          ...prev,
                          fasceOrariePreferite: checked
                            ? [...prev.fasceOrariePreferite, value]
                            : prev.fasceOrariePreferite.filter(
                                (f) => f !== value
                              ),
                        }))
                      }}
                      className="me-3"
                    />
                  ))}
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Corso Privato</Form.Label>
                <Form.Check
                  type="checkbox"
                  name="corsoPrivato"
                  checked={formData.corsoPrivato}
                  onChange={handleChange}
                />
              </Form.Group>

              {formData.corsoPrivato && (
                <Form.Group className="mb-3">
                  <Form.Label>Ore Settimanali</Form.Label>
                  <Form.Control
                    type="number"
                    name="frequenzaCorsoPrivato"
                    value={formData.frequenzaCorsoPrivato}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </Form.Group>
              )}

              {/* Tipo di Corso di Gruppo */}
              <Form.Group className="mb-3">
                <Form.Label>Tipo di Corso di Gruppo</Form.Label>
                <Form.Select
                  name="tipoCorsoGruppo"
                  value={formData.tipoCorsoGruppo}
                  onChange={handleChange}
                >
                  <option value="1 volta a settimana">
                    1 volta a settimana
                  </option>
                  <option value="2 volte a settimana">
                    2 volte a settimana
                  </option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Insegnante Preferito</Form.Label>
                <Form.Select
                  name="insegnanteId"
                  value={formData.insegnanteId}
                  onChange={handleChange}
                >
                  <option value="">Nessuna preferenza</option>
                  {insegnanti.map((insegnante) => (
                    <option key={insegnante.id} value={insegnante.id}>
                      {insegnante.nome} {insegnante.cognome}
                    </option>
                  ))}
                </Form.Select>
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

        {/* 🔎 Filtro Studenti */}
        <div className="row mb-3">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Filtra per nome"
              value={filtroNome}
              onChange={(e) => setFiltroNome(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Filtra per cognome"
              value={filtroCognome}
              onChange={(e) => setFiltroCognome(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Filtra per livello"
              value={filtroLivello}
              onChange={(e) => setFiltroLivello(e.target.value)}
            />
          </div>
        </div>

        {/* 📌 Studenti con Corso */}
        <h4>📌 Studenti con Corso</h4>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Cognome</th>
              <th>Livello</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {filtraStudenti(studenti).map((studente) => (
              <tr key={studente.id}>
                <td>{studente.nome}</td>
                <td>{studente.cognome}</td>
                <td>{studente.livello}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => navigate(`/studenti/${studente.id}`)}
                  >
                    📄 Dettagli
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => eliminaStudente(studente.id)}
                  >
                    🗑 Elimina
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* ⚠️ Studenti Senza Corso */}
        <h4 className="mt-4">⚠️ Studenti Senza Corso</h4>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Cognome</th>
              <th>Livello</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {filtraStudenti(studentiSenzaCorso).map((studente) => (
              <tr key={studente.id}>
                <td>{studente.nome}</td>
                <td>{studente.cognome}</td>
                <td>{studente.livello}</td>
                <td>
                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => navigate(`/studenti/${studente.id}`)}
                >
                  📄 Dettagli
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => eliminaStudente(studente.id)}
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

export default StudentList
