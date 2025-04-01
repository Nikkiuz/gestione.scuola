import { useEffect, useState } from 'react'
import { Modal, Form, Button,} from 'react-bootstrap'
import apiClient from '../api/apiClient'
import CustomSpinner from './CustomSpinner'

const LIVELLI = [
  'STARTERS',
  'KIDS_BOX1',
  'KIDS_BOX2',
  'KIDS_BOX3',
  'KET_CAMBRIDGE',
  'PET_CAMBRIDGE',
  'FIRST_CAMBRIDGE',
  'ADVANCED_CAMBRIDGE',
  'A2_ADULTI',
  'B1_ADULTI',
  'B2_ADULTI',
  'C1_ADULTI',
  'C2_ADULTI',
]

const FREQUENZE = ['1 volta a settimana', '2 volte a settimana']
const TIPI_CORSO = ['GRUPPO', 'PRIVATO']

const ModaleCorso = ({ show, onHide, corso = null, refresh }) => {
  const [formCorso, setFormCorso] = useState({
    lingua: '',
    livello: 'STARTERS',
    tipoCorso: 'GRUPPO',
    frequenza: '',
    giorno: '',
    orario: '',
    secondoGiorno: '',
    secondoOrario: '',
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
          secondoGiorno: corso.secondoGiorno || '',
          secondoOrario: corso.secondoOrario || '',
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
          secondoGiorno: '',
          secondoOrario: '',
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
        {saving ? (
          <CustomSpinner message="Salvataggio corso in corso..." />
        ) : (
          <Form onSubmit={handleSalva}>
              <Form.Select
                          name="linguaDaImparare"
                          value={formCorso.lingua || ''}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Seleziona una lingua</option>
                          <option value="INGLESE">Inglese</option>
                          <option value="FRANCESE">Francese</option>
                          <option value="SPAGNOLO">Spagnolo</option>
                        </Form.Select>
            

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
                placeholder="Es. Lunedì"
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
                placeholder="Es. 10:00-12:00"
              />
            </Form.Group>

            {formCorso.frequenza === '2 volte a settimana' && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Secondo Giorno</Form.Label>
                  <Form.Control
                    type="text"
                    name="secondoGiorno"
                    value={formCorso.secondoGiorno}
                    onChange={handleChange}
                    required
                    placeholder="Es. Mercoledì"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Secondo Orario</Form.Label>
                  <Form.Control
                    type="text"
                    name="secondoOrario"
                    value={formCorso.secondoOrario}
                    onChange={handleChange}
                    required
                    placeholder="Es. 14:00-16:00"
                  />
                </Form.Group>
              </>
            )}

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
              💾 Salva
            </Button>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  )
}

export default ModaleCorso
