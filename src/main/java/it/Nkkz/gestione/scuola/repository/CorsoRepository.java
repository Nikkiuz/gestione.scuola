package it.Nkkz.gestione.scuola.repository;

import it.Nkkz.gestione.scuola.entity.Corso;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CorsoRepository extends JpaRepository<Corso, Long> {
	List<Corso> findByInsegnanteId(Long insegnanteId);

	List<Corso> findByGiornoAndOrario(String giorno, String orario);

	List<Corso> findByLinguaAndLivello(String lingua, String livello);

	List<Corso> findByTipoCorso(String tipoCorso);
}
