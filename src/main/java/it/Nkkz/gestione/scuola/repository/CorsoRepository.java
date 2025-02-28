package it.Nkkz.gestione.scuola.repository;

import it.Nkkz.gestione.scuola.entity.Corso;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CorsoRepository extends JpaRepository<Corso, Long> {
	List<Corso> findByInsegnanteId(Long insegnanteId);
}
