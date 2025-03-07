import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/apiClient'

const StudentList = () => {
  const [studenti, setStudenti] = useState([])
  const [studentiSenzaCorso, setStudentiSenzaCorso] = useState([])
  const [filtroNome, setFiltroNome] = useState('')
  const [filtroCognome, setFiltroCognome] = useState('')
  const [filtroLivello, setFiltroLivello] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchStudenti()
  }, [])

  const fetchStudenti = async () => {
    try {
      const response = await apiClient.get('/studenti')
      setStudenti(response.data.filter((s) => s.corsi.length > 0))
      setStudentiSenzaCorso(response.data.filter((s) => s.corsi.length === 0))
    } catch (error) {
      console.error('Errore nel recupero degli studenti', error)
    }
  }

  const handleDettaglio = (id) => {
    navigate(`/studenti/${id}`)
  }

  const filtraStudenti = (lista) => {
    return lista.filter(
      (s) =>
        s.nome.toLowerCase().includes(filtroNome.toLowerCase()) &&
        s.cognome.toLowerCase().includes(filtroCognome.toLowerCase()) &&
        s.livello.toLowerCase().includes(filtroLivello.toLowerCase())
    )
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">🎓 Gestione Studenti</h2>

      {/* Filtri di ricerca */}
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

      {/* Studenti Assegnati a un Corso */}
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
                  className="btn btn-primary btn-sm"
                  onClick={() => handleDettaglio(studente.id)}
                >
                  🔍 Dettagli
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Studenti Senza Corso */}
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
                  className="btn btn-primary btn-sm"
                  onClick={() => handleDettaglio(studente.id)}
                >
                  🔍 Dettagli
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default StudentList
