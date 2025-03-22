import React from 'react'
import { Modal, Form, Button } from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const ModalePagamento = ({
  show,
  onHide,
  pagamentoSelezionato = {}, // Default a un oggetto vuoto
  setPagamentoSelezionato,
  isEditing,
  handleSubmit,
  studenti = [], // Default a un array vuoto
  disableStudentSelect = false, // Prop per disabilitare la selezione dello studente
}) => {
  if (!pagamentoSelezionato) {
    return null // Evita errori se il pagamento è null o undefined
  }

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEditing ? '✏️ Modifica Pagamento' : '➕ Aggiungi Pagamento'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* Campo Studente */}
          {!disableStudentSelect && (
            <Form.Group className="mb-3">
              <Form.Label>🎓 Studente</Form.Label>
              <Form.Select
                name="studenteId"
                value={pagamentoSelezionato.studenteId || ''}
                onChange={(e) =>
                  setPagamentoSelezionato({
                    ...pagamentoSelezionato,
                    studenteId: e.target.value,
                  })
                }
                required
                disabled={isEditing}
              >
                <option value="">Seleziona Studente</option>
                {studenti.map((studente) => (
                  <option key={studente.id} value={studente.id}>
                    {studente.nome} {studente.cognome}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          )}

          {/* Campo Mensilità Saldata */}
          <Form.Group className="mb-3">
            <Form.Label>✅ Mensilità Saldata</Form.Label>
            <Form.Select
              name="mensilitaSaldata"
              value={pagamentoSelezionato.mensilitaSaldata || ''}
              onChange={(e) =>
                setPagamentoSelezionato({
                  ...pagamentoSelezionato,
                  mensilitaSaldata: e.target.value,
                })
              }
              required
            >
              <option value="">Seleziona Mensilità</option>
              {Array.from({ length: 12 }, (_, i) => {
                const mese = new Date(0, i).toLocaleString('it', {
                  month: 'long',
                })
                return (
                  <option
                    key={mese}
                    value={`${mese} ${new Date().getFullYear()}`}
                  >
                    {mese} {new Date().getFullYear()}
                  </option>
                )
              })}
            </Form.Select>
          </Form.Group>

          {/* Campo Data Pagamento */}
          <Form.Group className="mb-3">
            <Form.Label>📆 Data Pagamento</Form.Label>
            <DatePicker
              selected={
                pagamentoSelezionato.dataPagamento
                  ? new Date(pagamentoSelezionato.dataPagamento)
                  : new Date()
              }
              onChange={(date) =>
                setPagamentoSelezionato({
                  ...pagamentoSelezionato,
                  dataPagamento: date,
                })
              }
              dateFormat="yyyy-MM-dd"
              className="form-control"
              required
            />
          </Form.Group>

          {/* Campo Importo */}
          <Form.Group className="mb-3">
            <Form.Label>💰 Importo (€)</Form.Label>
            <Form.Control
              type="number"
              name="importo"
              value={pagamentoSelezionato.importo || ''}
              onChange={(e) =>
                setPagamentoSelezionato({
                  ...pagamentoSelezionato,
                  importo: e.target.value,
                })
              }
              min="0.01"
              step="0.01"
              required
            />
          </Form.Group>

          {/* Campo Metodo di Pagamento */}
          <Form.Group className="mb-3">
            <Form.Label>💳 Metodo di Pagamento</Form.Label>
            <Form.Select
              name="metodoPagamento"
              value={pagamentoSelezionato.metodoPagamento || 'CARTA'}
              onChange={(e) =>
                setPagamentoSelezionato({
                  ...pagamentoSelezionato,
                  metodoPagamento: e.target.value,
                })
              }
              required
            >
              <option value="CARTA">Carta</option>
              <option value="BONIFICO">Bonifico</option>
            </Form.Select>
          </Form.Group>

          {/* Campo Numero Ricevuta */}
          <Form.Group className="mb-3">
            <Form.Label>🧾 Numero Ricevuta</Form.Label>
            <Form.Control
              type="text"
              name="numeroRicevuta"
              value={pagamentoSelezionato.numeroRicevuta}
              onChange={(e) =>
                setPagamentoSelezionato({
                  ...pagamentoSelezionato,
                  numeroRicevuta: e.target.value,
                })
              }
              required
            />
          </Form.Group>

          {/* Campo Note */}
          <Form.Group className="mb-3">
            <Form.Label>📝 Note</Form.Label>
            <Form.Control
              as="textarea"
              name="note"
              value={pagamentoSelezionato.note || ''}
              onChange={(e) =>
                setPagamentoSelezionato({
                  ...pagamentoSelezionato,
                  note: e.target.value,
                })
              }
            />
          </Form.Group>

          {/* Pulsante di Invio */}
          <Button type="submit" variant="success">
            {isEditing ? '💾 Salva Modifiche' : '✅ Aggiungi Pagamento'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default ModalePagamento
