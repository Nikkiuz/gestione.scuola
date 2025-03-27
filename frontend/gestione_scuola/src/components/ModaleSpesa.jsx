import React from 'react'
import { Modal, Form, Button } from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { registerLocale } from 'react-datepicker'
import it from 'date-fns/locale/it'

registerLocale('it', it)

const ModaleSpesa = ({
  show,
  onHide,
  formData,
  setFormData,
  handleSubmit,
  isEditing = false,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      dataSpesa: date,
    }))
  }

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEditing ? '✏️ Modifica Spesa' : '➕ Aggiungi Spesa'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Categoria</Form.Label>
            <Form.Select
              name="categoria"
              value={formData.categoria || ''}
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
              placeholder="Es. 120.50"
              value={formData.importo || ''}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>📆 Data Spesa</Form.Label>
            <DatePicker
              selected={
                formData.dataSpesa ? new Date(formData.dataSpesa) : new Date()
              }
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              locale="it"
              className="form-control ms-2"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descrizione</Form.Label>
            <Form.Control
              type="text"
              name="descrizione"
              value={formData.descrizione || ''}
              onChange={handleChange}
            />
          </Form.Group>

          <Button type="submit" variant="success">
            {isEditing ? '💾 Salva Modifiche' : '✅ Aggiungi Spesa'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default ModaleSpesa
