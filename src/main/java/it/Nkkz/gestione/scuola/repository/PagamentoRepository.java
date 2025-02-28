package it.Nkkz.gestione.scuola.repository;

import it.Nkkz.gestione.scuola.entity.Pagamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PagamentoRepository extends JpaRepository<Pagamento, Long> {

	// ✅ Recupera tutti i pagamenti di uno studente
	List<Pagamento> findByStudenteId(Long studenteId);

	// ✅ Recupera i pagamenti per una specifica mensilità
	List<Pagamento> findByMensilitaSaldata(String mensilita);
}
