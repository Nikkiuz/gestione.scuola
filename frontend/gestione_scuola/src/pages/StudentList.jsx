import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/apiClient'
import AdminNavbar from '../components/AdminNavbar'
import ModaleStudente from '../components/ModaleStudente'

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

  const resetFormData = () => {
    setFormData({
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
  }

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
const handleSubmit = async (e) => {
  e.preventDefault()
  try {
    const response = await apiClient.post('/studenti', formData)
    console.log('✅ Studente aggiunto con successo:', response.data)

    alert('✅ Studente aggiunto correttamente!')
    setShowModal(false) // Chiudi il modale
    resetFormData() // Resetta il form
    fetchStudenti() // Aggiorna la lista degli studenti
  } catch (error) {
    console.error('❌ Errore nella creazione dello studente', error)
    alert(`Errore: ${error.response?.data?.message || 'Errore sconosciuto.'}`)
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

        <ModaleStudente
          show={showModal}
          onHide={() => setShowModal(false)}
          formStudente={formData}
          setFormStudente={setFormData}
          handleSalvaModificheStudente={handleSubmit}
          insegnanti={insegnanti}
        />

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
