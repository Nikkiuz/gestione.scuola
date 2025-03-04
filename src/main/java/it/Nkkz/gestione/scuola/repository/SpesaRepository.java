package it.Nkkz.gestione.scuola.repository;

import it.Nkkz.gestione.scuola.entity.Spesa;
import it.Nkkz.gestione.scuola.entity.Spesa.CategoriaSpesa;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface SpesaRepository extends JpaRepository<Spesa, Long> {

	// Trova tutte le spese di una determinata categoria
	List<Spesa> findByCategoria(CategoriaSpesa categoria);

	List<Spesa> findByDataSpesaBetween(LocalDate startDate, LocalDate endDate);
}
