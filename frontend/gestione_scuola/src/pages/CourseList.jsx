import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';

const CourseList = () => {
  const [corsiGruppo, setCorsiGruppo] = useState([]);
  const [corsiPrivati, setCorsiPrivati] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCorsi();
  }, []);

  const fetchCorsi = async () => {
    try {
      const response = await apiClient.get('/corsi');
      const corsi = response.data;
      setCorsiGruppo(corsi.filter(c => c.tipoCorso === 'GRUPPO'));
      setCorsiPrivati(corsi.filter(c => c.tipoCorso === 'PRIVATO'));
    } catch (error) {
      console.error('Errore nel recupero dei corsi', error);
      setError('Errore nel caricamento dei corsi.');
    } finally {
      setLoading(false);
    }
  };

  const disattivaCorso = async (id) => {
    if (window.confirm('Sei sicuro di voler disattivare questo corso?')) {
      try {
        await apiClient.put(`/corsi/${id}/disattiva`);
        fetchCorsi();
      } catch (error) {
        console.error('Errore nella disattivazione del corso', error);
      }
    }
  };

  const eliminaCorso = async (id) => {
    if (window.confirm('Eliminare definitivamente il corso?')) {
      try {
        await apiClient.delete(`/corsi/${id}`);
        fetchCorsi();
      } catch (error) {
       console.error(`Errore nell'eliminazione del corso`, error)
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Gestione Corsi</h2>

      <div className="d-flex justify-content-between mb-3">
        <button className="btn btn-success" onClick={() => navigate('/corsi/nuovo')}>➕ Crea Nuovo Corso</button>
        <button className="btn btn-primary" onClick={() => apiClient.post('/corsi/genera-automaticamente')}>⚙️ Genera Corsi Automaticamente</button>
      </div>

      {loading ? <p>Caricamento...</p> : error ? <div className="alert alert-danger">{error}</div> : (
        <>
          <h4>📌 Corsi di Gruppo</h4>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Lingua</th>
                <th>Livello</th>
                <th>Giorno</th>
                <th>Orario</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {corsiGruppo.map(corso => (
                <tr key={corso.id}>
                  <td>{corso.lingua}</td>
                  <td>{corso.livello}</td>
                  <td>{corso.giorno}</td>
                  <td>{corso.orario}</td>
                  <td>
                    <button className="btn btn-info btn-sm me-2" onClick={() => navigate(`/corsi/${corso.id}`)}>🔍 Dettagli</button>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => disattivaCorso(corso.id)}>⛔ Disattiva</button>
                    <button className="btn btn-danger btn-sm" onClick={() => eliminaCorso(corso.id)}>🗑️ Elimina</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h4>📌 Corsi Privatisti</h4>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Lingua</th>
                <th>Livello</th>
                <th>Giorno</th>
                <th>Orario</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {corsiPrivati.map(corso => (
                <tr key={corso.id}>
                  <td>{corso.lingua}</td>
                  <td>{corso.livello}</td>
                  <td>{corso.giorno}</td>
                  <td>{corso.orario}</td>
                  <td>
                    <button className="btn btn-info btn-sm me-2" onClick={() => navigate(`/corsi/${corso.id}`)}>🔍 Dettagli</button>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => disattivaCorso(corso.id)}>⛔ Disattiva</button>
                    <button className="btn btn-danger btn-sm" onClick={() => eliminaCorso(corso.id)}>🗑️ Elimina</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default CourseList;
