package it.Nkkz.gestione.scuola.repository;

import it.Nkkz.gestione.scuola.entity.Corso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Arrays;
import java.util.List;

@Repository
public interface CorsoRepository extends JpaRepository<Corso, Long> {

	//Trova tutti i corsi attivi
	List<Corso> findByAttivoTrue();

<<<<<<< Updated upstream
	// ✅ Trova tutti i corsi per lingua e livello
	List<Corso> findByLinguaAndLivelloAndAttivoTrue(String lingua, String livello);
=======
	//Trova tutti i corsi NON attivi (disattivati)
	List<Corso> findByAttivoFalse();

	//Trova tutti i corsi per lingua e livello
	List<Corso> findByLinguaAndLivelloAndAttivoTrue(String lingua, Livello livello);
>>>>>>> Stashed changes

	//Trova i corsi di un insegnante
	List<Corso> findByInsegnanteIdAndAttivoTrue(Long insegnanteId);

<<<<<<< Updated upstream
	// ✅ Trova i corsi per giorno e orario (per liberare un orario)
	List<Corso> findByGiornoAndOrarioAndAttivoTrue(String giorno, String orario);

	// ✅ Query per contare le ore totali insegnate da un docente in un periodo
	@Query("SELECT COUNT(c) FROM Corso c WHERE c.insegnante.id = :insegnanteId AND c.attivo = true")
	int countOreInsegnateByInsegnante(Long insegnanteId);

	List<Corso> findByTipoCorsoAndAttivoTrue(String tipoCorso);
=======
	//Trova i corsi per giorno e orario
	List<Corso> findByGiornoAndOrarioAndAttivoTrue(String giorno, String orario);

	//Trova i corsi programmati in un determinato giorno della settimana
	List<Corso> findByGiornoAndAttivoTrue(String giorno);

	//Trova corsi per tipologia
	List<Corso> findByTipoCorsoAndAttivoTrue(String tipoCorso);

	//Trova i corsi attivi per aula, giorno e orario (per evitare sovrapposizioni)
	List<Corso> findByAulaIdAndGiornoAndOrarioAndAttivoTrue(Long aulaId, String giorno, String orario);



>>>>>>> Stashed changes
}
