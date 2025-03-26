import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import apiClient from '../api/apiClient'
import AdminNavbar from '../components/AdminNavbar'
import 'react-datepicker/dist/react-datepicker.css'
import { registerLocale } from 'react-datepicker'
import it from 'date-fns/locale/it'
import ModalePagamento from '../components/ModalePagamento'
import CustomSpinner from '../components/CustomSpinner'

registerLocale('it', it)

const PagamentiDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pagamento, setPagamento] = useState(null)
  const [studenti, setStudenti] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    studenteId: '',
    dataPagamento: new Date(),
    importo: '',
    mensilitaSaldata: '',
    metodoPagamento: 'CARTA',
    numeroRicevuta: '',
    note: '',
  })

  useEffect(() => {
    fetchPagamento()
    fetchStudenti()
  }, [])

  const fetchPagamento = async () => {
    try {
      const response = await apiClient.get(`/pagamenti/${id}`)
      setPagamento(response.data)

      // Imposta i dati nel form per la modifica
      setFormData({
        studenteId: response.data.studenteId,
        dataPagamento: new Date(response.data.dataPagamento),
        importo: response.data.importo,
        mensilitaSaldata: response.data.mensilitaSaldata,
        metodoPagamento: response.data.metodoPagamento,
        numeroRicevuta: response.data.numeroRicevuta,
        note: response.data.note || '',
      })
    } catch (error) {
      setError('Errore nel caricamento del pagamento.', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStudenti = async () => {
    try {
      const response = await apiClient.get('/studenti') // Verifica l'endpoint
      setStudenti(response.data)
    } catch (error) {
      console.error('❌ Errore nel recupero degli studenti:', error)
      setError(
        "Errore nel recupero degli studenti. Controlla la connessione o l'endpoint."
      )
    }
  }

  const eliminaPagamento = async () => {
    if (window.confirm('Vuoi eliminare questo pagamento?')) {
      try {
       await apiClient.delete(`/pagamenti/${id}`)
       alert('✅ Pagamento eliminato con successo!')
       sessionStorage.setItem('refreshReport', 'true')

      } catch (error) {
        setError('Errore nella cancellazione del pagamento.', error)
      }
    }
  }

  if (loading) return <CustomSpinner message="Caricamento pagamento..." />
  if (error) return <div className="alert alert-danger">{error}</div>
  if (!pagamento) return <p>⚠️ Nessun pagamento trovato.</p>

 return (
   <>
     <AdminNavbar />
     <div className="container pt-5 mt-5">
       <h2 className="text-center mb-4">💳 Dettaglio Pagamento</h2>

       <div className="card p-4 shadow">
         <p>
           <strong>📅 Data:</strong>{' '}
           {new Date(formData.dataPagamento).toLocaleDateString('it-IT')}
         </p>
         <p>
           <strong>🎓 Studente:</strong>{' '}
           {studenti.find((s) => s.id === formData.studenteId)?.nome}{' '}
           {studenti.find((s) => s.id === formData.studenteId)?.cognome}
         </p>
         <p>
           <strong>💰 Importo:</strong> € {formData.importo}
         </p>
         <p>
           <strong>📆 Mensilità:</strong> {formData.mensilitaSaldata}
         </p>
         <p>
           <strong>🏦 Metodo:</strong> {formData.metodoPagamento}
         </p>
         <p>
           <strong>🧾 Numero Ricevuta:</strong> {formData.numeroRicevuta}
         </p>
         <p>
           <strong>📝 Note:</strong> {formData.note || '—'}
         </p>

         <div className="d-flex flex-wrap gap-2 mt-3">
           <Button variant="primary" onClick={() => setIsEditing(true)}>
             ✏️ Modifica Pagamento
           </Button>

           <Button variant="danger" onClick={eliminaPagamento}>
             🗑 Elimina Pagamento
           </Button>
         </div>
       </div>

       <Button
         className="btn btn-secondary mt-3"
         onClick={() => navigate('/pagamenti')}
       >
         🔙 Torna alla lista pagamenti
       </Button>

       {/* 🔹 Modale di Modifica */}
       <ModalePagamento
         show={isEditing}
         onHide={() => setIsEditing(false)}
         pagamentoSelezionato={formData}
         setPagamentoSelezionato={setFormData}
         isEditing={true}
         studenti={studenti}
         disableStudentSelect={true}
         handleSubmit={async (e) => {
           e.preventDefault()
           try {
             await apiClient.put(`/pagamenti/${id}`, {
               ...formData,
               dataPagamento: formData.dataPagamento
                 .toISOString()
                 .split('T')[0],
             })
             alert('✅ Modifica salvata con successo!')
             setIsEditing(false)
             fetchPagamento()
             sessionStorage.setItem('refreshReport', 'true')
           } catch (error) {
             console.error('❌ Errore nel salvataggio:', error)
             alert('Errore durante la modifica del pagamento.')
           }
         }}
       />
     </div>
   </>
 )

}

export default PagamentiDetail
