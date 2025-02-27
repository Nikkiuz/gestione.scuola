package it.Nkkz.gestione.scuola.repository;

import it.Nkkz.gestione.scuola.entity.Studente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudenteRepository extends JpaRepository<Studente, Long> {
	List<Studente> findByLinguaDaImparare(String lingua);
	List<Studente> findByInsegnanteId(Long insegnanteId);
}
