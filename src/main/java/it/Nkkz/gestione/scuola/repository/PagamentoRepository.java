package it.Nkkz.gestione.scuola.repository;

import it.Nkkz.gestione.scuola.entity.Pagamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PagamentoRepository extends JpaRepository<Pagamento, Long> {

	// ✅ Recupera tutti i pagamenti di uno studente
	List<Pagamento> findByStudenteId(Long studenteId);

	// ✅ Recupera i pagamenti per una specifica mensilità
	List<Pagamento> findByMensilitaSaldata(String mensilita);

	List<Pagamento> findByDataPagamentoBetween(LocalDate start, LocalDate end);

	@Query("SELECT COALESCE(SUM(p.importo), 0) FROM Pagamento p")
	double getTotalePagamenti();

}
