package it.Nkkz.gestione.scuola.controller;

import it.Nkkz.gestione.scuola.repository.StudenteRepository;
import it.Nkkz.gestione.scuola.repository.CorsoRepository;
import it.Nkkz.gestione.scuola.repository.PagamentoRepository;
import it.Nkkz.gestione.scuola.entity.Pagamento;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Month;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

	private final StudenteRepository studenteRepository;
	private final CorsoRepository corsoRepository;
	private final PagamentoRepository pagamentoRepository;

	public DashboardController(StudenteRepository studenteRepository, CorsoRepository corsoRepository, PagamentoRepository pagamentoRepository) {
		this.studenteRepository = studenteRepository;
		this.corsoRepository = corsoRepository;
		this.pagamentoRepository = pagamentoRepository;
	}

	@GetMapping("/stats")
	public ResponseEntity<Map<String, Object>> getStats() {
		// ✅ Recupera il numero totale di studenti, corsi e pagamenti dal database
		long totaleStudenti = studenteRepository.count();
		long totaleCorsi = corsoRepository.count();
		double totalePagamenti = pagamentoRepository.getTotalePagamenti();

		Map<String, Object> stats = Map.of(
			"studenti", totaleStudenti,
			"corsi", totaleCorsi,
			"pagamenti", totalePagamenti
		);
		return ResponseEntity.ok(stats);
	}

	@GetMapping("/avvisi")
	public ResponseEntity<List<Map<String, String>>> getAvvisi() {
		// ✅ Recupera gli avvisi dal database (se hai una tabella AvvisiRepository, sostituisci questa parte)
		List<Map<String, String>> avvisi = new ArrayList<>();
		return ResponseEntity.ok(avvisi);
	}

	@GetMapping("/pagamenti-mensili")
	public ResponseEntity<Map<String, Object>> getPagamentiMensili() {
		// ✅ Recupera e aggrega i pagamenti per mese
		List<Pagamento> pagamenti = pagamentoRepository.findAll();

		Map<Month, Double> pagamentiPerMese = new HashMap<>();
		for (Pagamento pagamento : pagamenti) {
			Month mese = pagamento.getDataPagamento().getMonth();
			pagamentiPerMese.put(mese, pagamentiPerMese.getOrDefault(mese, 0.0) + pagamento.getImporto());
		}

		List<String> mesi = pagamentiPerMese.keySet().stream()
			.sorted(Comparator.comparing(Enum::ordinal))
			.map(Month::name)
			.collect(Collectors.toList());

		List<Double> importi = mesi.stream().map(m -> pagamentiPerMese.get(Month.valueOf(m))).collect(Collectors.toList());

		Map<String, Object> response = Map.of(
			"mesi", mesi,
			"importi", importi
		);

		return ResponseEntity.ok(response);
	}
}
