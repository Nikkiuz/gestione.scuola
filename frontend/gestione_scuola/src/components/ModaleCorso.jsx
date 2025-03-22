import { useEffect, useState } from 'react'
import { Modal, Form, Button, Spinner } from 'react-bootstrap'
import apiClient from '../api/apiClient'

const LIVELLI = ['BASE', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2']
const FREQUENZE = ['1 volta a settimana', '2 volte a settimana']
const TIPI_CORSO = ['GRUPPO', 'PRIVATO']

const ModaleCorso = ({ show, onHide, corso = null, refresh }) => {
  const [formCorso, setFormCorso] = useState({
    lingua: '',
    livello: 'BASE',
    tipoCorso: 'GRUPPO',
    frequenza: '',
    giorno: '',
    orario: '',
    insegnanteId: '',
    aulaId: '',
  })
  const [studentiDisponibili, setStudentiDisponibili] = useState([])
  const [studentiAssegnati, setStudentiAssegnati] = useState([])
  const [insegnanti, setInsegnanti] = useState([])
  const [aule, setAule] = useState([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (show) {
      fetchInsegnanti()
      fetchAule()
      fetchStudentiDisponibili()

      if (corso) {
        setFormCorso({
          lingua: corso.lingua,
          livello: corso.livello,
          tipoCorso: corso.tipoCorso,
          frequenza: corso.frequenza,
          giorno: corso.giorno,
          orario: corso.orario,
          insegnanteId: corso.insegnante?.id || '',
          aulaId: corso.aula?.id || '',
        })
        setStudentiAssegnati(corso.studenti || [])
      } else {
        // Reset se è nuovo
        setFormCorso({
          lingua: '',
          livello: 'BASE',
          tipoCorso: 'GRUPPO',
          frequenza: '',
          giorno: '',
          orario: '',
          insegnanteId: '',
          aulaId: '',
        })
        setStudentiAssegnati([])
      }
    }
  }, [show, corso])

  const fetchInsegnanti = async () => {
    try {
      const res = await apiClient.get('/insegnanti')
      setInsegnanti(res.data || [])
    } catch (error) {
      console.error('Errore nel recupero insegnanti', error)
    }
  }

  const fetchAule = async () => {
    try {
      const res = await apiClient.get('/aule')
      setAule(res.data || [])
    } catch (error) {
      console.error('Errore nel recupero aule', error)
    }
  }

  const fetchStudentiDisponibili = async () => {
    try {
      const res = await apiClient.get('/studenti/senza-corso')
      setStudentiDisponibili(res.data || [])
    } catch (error) {
      console.error('Errore nel recupero studenti disponibili', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormCorso((prev) => ({ ...prev, [name]: value }))
  }

  const handleAggiungiStudente = (studente) => {
    setStudentiDisponibili((prev) => prev.filter((s) => s.id !== studente.id))
    setStudentiAssegnati((prev) => [...prev, studente])
  }

  const handleRimuoviStudente = (studente) => {
    setStudentiAssegnati((prev) => prev.filter((s) => s.id !== studente.id))
    setStudentiDisponibili((prev) => [...prev, studente])
  }

  const handleSalva = async (e) => {
    e.preventDefault()
    setSaving(true)

    const payload = {
      ...formCorso,
      studentiIds: studentiAssegnati.map((s) => s.id),
    }

    try {
      if (corso) {
        await apiClient.put(`/corsi/${corso.id}`, payload)
        alert('✅ Corso aggiornato con successo!')
      } else {
        await apiClient.post('/corsi', payload)
        alert('✅ Corso creato con successo!')
      }
      onHide()
      refresh()
    } catch (error) {
      console.error('❌ Errore durante il salvataggio del corso', error)
      alert('Errore durante il salvataggio del corso.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {corso ? '✏️ Modifica Corso' : '🆕 Crea Nuovo Corso'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSalva}>
          <Form.Group className="mb-3">
            <Form.Label>Lingua</Form.Label>
            <Form.Control
              type="text"
              name="lingua"
              value={formCorso.lingua}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Livello</Form.Label>
            <Form.Select
              name="livello"
              value={formCorso.livello}
              onChange={handleChange}
              required
            >
              {LIVELLI.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tipo Corso</Form.Label>
            <Form.Select
              name="tipoCorso"
              value={formCorso.tipoCorso}
              onChange={handleChange}
              required
            >
              {TIPI_CORSO.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Frequenza</Form.Label>
            <Form.Select
              name="frequenza"
              value={formCorso.frequenza}
              onChange={handleChange}
              required
            >
              <option value="">Seleziona frequenza</option>
              {FREQUENZE.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Giorno</Form.Label>
            <Form.Control
              type="text"
              name="giorno"
              value={formCorso.giorno}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Orario</Form.Label>
            <Form.Control
              type="text"
              name="orario"
              value={formCorso.orario}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Insegnante</Form.Label>
            <Form.Select
              name="insegnanteId"
              value={formCorso.insegnanteId}
              onChange={handleChange}
              required
            >
              <option value="">Seleziona insegnante</option>
              {insegnanti.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.nome} {i.cognome}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Aula</Form.Label>
            <Form.Select
              name="aulaId"
              value={formCorso.aulaId}
              onChange={handleChange}
              required
            >
              <option value="">Seleziona aula</option>
              {aule.map((aula) => (
                <option key={aula.id} value={aula.id}>
                  {aula.nome}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <hr />

          <h5>🎓 Studenti Assegnati</h5>
          <ul>
            {studentiAssegnati.map((studente) => (
              <li key={studente.id}>
                {studente.nome} {studente.cognome}
                <Button
                  variant="danger"
                  size="sm"
                  className="ms-2"
                  onClick={() => handleRimuoviStudente(studente)}
                >
                  Rimuovi
                </Button>
              </li>
            ))}
          </ul>

          <h5 className="mt-4">🎓 Studenti Disponibili</h5>
          <ul>
            {studentiDisponibili.map((studente) => (
              <li key={studente.id}>
                {studente.nome} {studente.cognome}
                <Button
                  variant="success"
                  size="sm"
                  className="ms-2"
                  onClick={() => handleAggiungiStudente(studente)}
                >
                  Aggiungi
                </Button>
              </li>
            ))}
          </ul>

          <Button
            type="submit"
            variant="primary"
            className="mt-3"
            disabled={saving}
          >
            {saving ? <Spinner animation="border" size="sm" /> : '💾 Salva'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default ModaleCorso
