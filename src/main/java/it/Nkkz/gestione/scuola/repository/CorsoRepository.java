package it.Nkkz.gestione.scuola.repository;

import it.Nkkz.gestione.scuola.entity.Corso;
import it.Nkkz.gestione.scuola.entity.Giorno;
import it.Nkkz.gestione.scuola.entity.Livello;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CorsoRepository extends JpaRepository<Corso, Long> {

	//Trova tutti i corsi attivi
	List<Corso> findByAttivoTrue();

	//Trova tutti i corsi NON attivi (disattivati)
	List<Corso> findByAttivoFalse();

	//Trova tutti i corsi per lingua e livello
	List<Corso> findByLinguaAndLivelloAndAttivoTrue(String lingua, Livello livello);

	//Trova i corsi di un insegnante
	List<Corso> findByInsegnanteIdAndAttivoTrue(Long insegnanteId);

	//Trova i corsi per giorno e orario
	List<Corso> findByGiornoAndOrarioAndAttivoTrue(Giorno giorno, String orario);

	//Trova i corsi programmati in un determinato giorno della settimana
	List<Corso> findByGiornoAndAttivoTrue(Giorno giorno);

	//Trova corsi per tipologia
	List<Corso> findByTipoCorsoAndAttivoTrue(String tipoCorso);

	//Trova i corsi attivi per aula, giorno e orario (per evitare sovrapposizioni)
	List<Corso> findByAulaIdAndGiornoAndOrarioAndAttivoTrue(Long aulaId, Giorno giorno, String orario);

}
