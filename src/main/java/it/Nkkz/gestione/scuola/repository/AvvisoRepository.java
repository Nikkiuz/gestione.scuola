package it.Nkkz.gestione.scuola.repository;

import it.Nkkz.gestione.scuola.entity.Avviso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvvisoRepository extends JpaRepository<Avviso, Long> {

	// Recupera gli ultimi 5 avvisi ordinati per data di creazione
	@Query("SELECT a FROM Avviso a ORDER BY a.dataCreazione DESC LIMIT 5")
	List<Avviso> findUltimiAvvisi();
}

