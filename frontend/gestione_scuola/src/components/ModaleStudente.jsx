import React from 'react'
import { Modal, Form, Button } from 'react-bootstrap'
import { useEffect } from 'react'
import OverlaySpinner from './OverlaySpinner'


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

const ModaleStudente = ({
  show,
  onHide,
  formStudente,
  setFormStudente,
  handleSalvaModificheStudente,
  insegnanti,
  loading,
}) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    const newValue =
      name === 'insegnanteId'
        ? Number(value) || null
        : type === 'checkbox'
        ? checked
        : value

    console.log(`📌 Campo: ${name} - Nuovo Valore:`, newValue) // 🔥 Debug

    setFormStudente({
      ...formStudente,
      [name]: newValue,
    })
  }

  const handleCheckboxChange = (e, field) => {
    const { value, checked } = e.target
    setFormStudente((prev) => ({
      ...prev,
      [field]: checked
        ? [...prev[field], value]
        : prev[field].filter((item) => item !== value),
    }))
  }

  useEffect(() => {
    if (show && formStudente) {
      console.log(
        '📌 Modale aperto. Stato attuale di formStudente:',
        formStudente
      )

      setFormStudente((prev) => ({
        ...prev,
        insegnanteId: prev.insegnanteId ? String(prev.insegnanteId) : '', //  Forza il valore come stringa per il Select
      }))
    }
  }, [show]) // Attiva il reset solo quando il modale si apre

  return (
    <div className="position-relative">
      {loading && <OverlaySpinner message="Salvataggio studente..." />}
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>✏️ Aggiungi Studente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSalvaModificheStudente}>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                name="nome"
                value={formStudente.nome || ''}
                onChange={handleChange}
                placeholder="Es. Mario"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cognome</Form.Label>
              <Form.Control
                type="text"
                name="cognome"
                value={formStudente.cognome || ''}
                onChange={handleChange}
                placeholder="Es. Rossi"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Età</Form.Label>
              <Form.Control
                type="number"
                name="eta"
                value={formStudente.eta || ''}
                onChange={handleChange}
                placeholder="Es. 25"
                required
              />
            </Form.Group>
            <Form.Select
              name="linguaDaImparare"
              value={formStudente.linguaDaImparare || ''}
              onChange={handleChange}
              required
            >
              <option value="">Seleziona una lingua</option>
              <option value="INGLESE">Inglese</option>
              <option value="FRANCESE">Francese</option>
              <option value="SPAGNOLO">Spagnolo</option>
            </Form.Select>

            <Form.Group className="mb-3">
              <Form.Label>Livello Iniziale</Form.Label>
              <Form.Select
                name="livello"
                value={
                  LIVELLI.includes(formStudente.livello)
                    ? formStudente.livello
                    : 'BASE'
                }
                onChange={handleChange}
              >
                {LIVELLI.map((livello) => (
                  <option key={livello} value={livello}>
                    {livello}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tipologia di Iscrizione</Form.Label>
              <Form.Control
                type="text"
                name="tipologiaIscrizione"
                value={formStudente.tipologiaIscrizione || ''}
                onChange={handleChange}
                placeholder="Es. Pacchetto"
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
                      checked={
                        formStudente.giorniPreferiti?.includes(giorno) || false
                      }
                      onChange={(e) =>
                        handleCheckboxChange(e, 'giorniPreferiti')
                      }
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
                    checked={
                      formStudente.fasceOrariePreferite?.includes(fascia) ||
                      false
                    }
                    onChange={(e) =>
                      handleCheckboxChange(e, 'fasceOrariePreferite')
                    }
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
                checked={formStudente.corsoPrivato || false}
                onChange={handleChange}
              />
            </Form.Group>

            {/* Mostra il campo solo se il corso è privato */}
            {formStudente.corsoPrivato && (
              <Form.Group className="mb-3">
                <Form.Label>Ore Settimanali</Form.Label>
                <Form.Control
                  type="number"
                  name="frequenzaCorsoPrivato"
                  value={formStudente.frequenzaCorsoPrivato || ''}
                  onChange={handleChange}
                  min="1"
                  placeholder="Minimo 1 ora settimanale"
                  required
                />
              </Form.Group>
            )}

            {/* Campo insegnante preferito (sempre visibile) */}
            <Form.Group className="mb-3">
              <Form.Label>Insegnante Preferito</Form.Label>
              <Form.Select
                name="insegnanteId"
                value={formStudente.insegnanteId || ''}
                onChange={handleChange}
              >
                <option value="">Nessuna preferenza</option>
                {insegnanti.map((insegnante) => (
                  <option key={insegnante.id} value={String(insegnante.id)}>
                    {' '}
                    {/* Forza `value` come stringa */}
                    {insegnante.nome} {insegnante.cognome}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Nascondi questi campi se corsoPrivato è attivo */}
            {!formStudente.corsoPrivato && (
              <Form.Group className="mb-3">
                <Form.Label>Tipo di Corso di Gruppo</Form.Label>
                <Form.Select
                  name="tipoCorsoGruppo"
                  value={formStudente.tipoCorsoGruppo || ''}
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
            )}

            <Button type="submit" variant="success">
              💾 Salva Modifiche
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default ModaleStudente
