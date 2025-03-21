package it.Nkkz.gestione.scuola.repository;

import it.Nkkz.gestione.scuola.entity.Livello;
import it.Nkkz.gestione.scuola.entity.Studente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface StudenteRepository extends JpaRepository<Studente, Long> {
	List<Studente> findByInsegnanteId(Long insegnanteId);
	List<Studente> findByLinguaDaImparareAndLivello(String linguaDaImparare, Livello livello);
	List<Studente> findByCorsoPrivato(boolean corsoPrivato);
	@Query("""
         SELECT s FROM Studente s
        LEFT JOIN s.corsi c WITH c.attivo = true
         WHERE c IS NULL
		""")
	List<Studente> findStudentiSenzaCorso();

}

