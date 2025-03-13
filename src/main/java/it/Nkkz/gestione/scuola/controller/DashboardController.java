package it.Nkkz.gestione.scuola.controller;

import it.Nkkz.gestione.scuola.dto.PagamentoMensileDTO;
import it.Nkkz.gestione.scuola.repository.AvvisoRepository;
import it.Nkkz.gestione.scuola.repository.StudenteRepository;
import it.Nkkz.gestione.scuola.repository.CorsoRepository;
import it.Nkkz.gestione.scuola.repository.PagamentoRepository;
import it.Nkkz.gestione.scuola.service.PagamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

	@Autowired
	private AvvisoRepository avvisoRepository;

	@Autowired
	private StudenteRepository studenteRepository;

	@Autowired
	private CorsoRepository corsoRepository;

	@Autowired
	private PagamentoRepository pagamentoRepository;

	@Autowired
	private PagamentoService pagamentoService;

	// ✅ Recupera i pagamenti mensili reali dal database
	@PreAuthorize("hasRole('ADMIN')")
	@GetMapping("/pagamenti-mensili")
	public ResponseEntity<PagamentoMensileDTO> getPagamentiMensili() {
		return ResponseEntity.ok(pagamentoService.getPagamentiMensili());
	}

	// ✅ Recupera statistiche reali (numero di studenti, corsi e pagamenti totali)
	@PreAuthorize("hasRole('ADMIN')")
	@GetMapping("/stats")
	public ResponseEntity<Map<String, Object>> getStats() {
		long numeroStudenti = studenteRepository.count();
		long numeroCorsi = corsoRepository.count();
		Double totalePagamenti = pagamentoRepository.getTotalePagamenti();

		return ResponseEntity.ok(Map.of(
			"studenti", numeroStudenti,
			"corsi", numeroCorsi,
			"pagamenti", totalePagamenti != null ? totalePagamenti : 0
		));
	}

	// ✅ Recupera gli ultimi avvisi reali dal database
	@PreAuthorize("hasRole('ADMIN')")
	@GetMapping("/avvisi")
	public ResponseEntity<List<Map<String, String>>> getAvvisi() {
		var avvisi = avvisoRepository.findUltimiAvvisi();

		List<Map<String, String>> response = avvisi.stream()
			.map(avviso -> Map.of(
				"messaggio", avviso.getMessaggio(),
				"link", avviso.getLink()
			))
			.collect(Collectors.toList());

		return ResponseEntity.ok(response);
	}
}
