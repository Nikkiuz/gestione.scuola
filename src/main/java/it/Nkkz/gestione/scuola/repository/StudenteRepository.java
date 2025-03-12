package it.Nkkz.gestione.scuola.repository;

import it.Nkkz.gestione.scuola.entity.Studente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface StudenteRepository extends JpaRepository<Studente, Long> {
	List<Studente> findByInsegnanteId(Long insegnanteId);
	List<Studente> findByLinguaDaImparareAndLivello(String linguaDaImparare, String livello);
	List<Studente> findByCorsoPrivato(boolean corsoPrivato);
	@Query("SELECT s FROM Studente s WHERE s NOT IN (SELECT DISTINCT s FROM Studente s JOIN s.corsi c)")
	List<Studente> findStudentiSenzaCorso();
}

