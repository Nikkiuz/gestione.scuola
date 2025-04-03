import { Modal, Form, Button } from 'react-bootstrap'

const LINGUE = ['INGLESE', 'FRANCESE', 'SPAGNOLO']

const GIORNI = ['LUNEDI', 'MARTEDI', 'MERCOLEDI', 'GIOVEDI', 'VENERDI']
const LABEL_GIORNI = {
  LUNEDI: 'Lunedì',
  MARTEDI: 'Martedì',
  MERCOLEDI: 'Mercoledì',
  GIOVEDI: 'Giovedì',
  VENERDI: 'Venerdì',
}

const FASCE_ORARIE = [
  '08:00-10:00',
  '10:00-12:00',
  '12:00-14:00',
  '14:00-16:00',
  '16:00-18:00',
  '18:00-20:00',
]

const ModaleInsegnante = ({
  show,
  onHide,
  insegnante = {},
  setInsegnante,
  onSubmit,
  modalTitle = 'Gestione Insegnante',
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target
    setInsegnante((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (e, field) => {
    const { value, checked } = e.target
    setInsegnante((prev) => ({
      ...prev,
      [field]: checked
        ? [...(prev[field] || []), value]
        : (prev[field] || []).filter((item) => item !== value),
    }))
  }

  return (
    <Modal show={show} onHide={onHide} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              name="nome"
              value={insegnante.nome || ''}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Cognome</Form.Label>
            <Form.Control
              name="cognome"
              value={insegnante.cognome || ''}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={insegnante.email || ''}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Lingua</Form.Label>
            <Form.Select
              name="lingua"
              value={insegnante.lingua || ''}
              onChange={handleChange}
              required
            >
              <option value="">Seleziona</option>
              {LINGUE.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Giorni Disponibili</Form.Label>
            <div className="d-flex flex-wrap">
              {GIORNI.map((giorno) => (
                <Form.Check
                  key={giorno}
                  type="checkbox"
                  label={LABEL_GIORNI[giorno]} 
                  value={giorno}
                  checked={(insegnante.giorniDisponibili || []).includes(
                    giorno
                  )}
                  onChange={(e) => handleCheckboxChange(e, 'giorniDisponibili')}
                  className="me-3"
                />
              ))}
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Fasce Orarie Disponibili</Form.Label>
            <div className="d-flex flex-wrap">
              {FASCE_ORARIE.map((fascia) => (
                <Form.Check
                  key={fascia}
                  type="checkbox"
                  label={fascia}
                  value={fascia}
                  checked={(insegnante.fasceOrarieDisponibili || []).includes(
                    fascia
                  )}
                  onChange={(e) =>
                    handleCheckboxChange(e, 'fasceOrarieDisponibili')
                  }
                  className="me-3"
                />
              ))}
            </div>
          </Form.Group>
          <div className="d-flex justify-content-end mt-4">
            <Button variant="secondary" onClick={onHide}>
              ❌ Annulla
            </Button>
            <Button type="submit" variant="success" className="ms-2">
              💾 Salva
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default ModaleInsegnante
