package it.Nkkz.gestione.scuola.service;

import it.Nkkz.gestione.scuola.entity.Corso;
import it.Nkkz.gestione.scuola.entity.Pagamento;
import it.Nkkz.gestione.scuola.repository.CorsoRepository;
import it.Nkkz.gestione.scuola.repository.PagamentoRepository;
import it.Nkkz.gestione.scuola.repository.StudenteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Month;
import java.util.*;

@Service
public class DashboardService {

	@Autowired
	private StudenteRepository studenteRepository;

	@Autowired
	private CorsoRepository corsoRepository;

	@Autowired
	private PagamentoRepository pagamentoRepository;

	public Map<String, Object> getStats() {
		long studenti = studenteRepository.count();
		long corsiAttivi = corsoRepository.findByAttivoTrue().size();
		double pagamenti = pagamentoRepository.getTotalePagamenti();

		return Map.of(
			"studenti", studenti,
			"corsi", corsiAttivi,
			"pagamenti", pagamenti
		);
	}

	public List<Map<String, String>> getAvvisi() {
		List<Map<String, String>> avvisi = new ArrayList<>();

		long studentiSenzaCorso = studenteRepository.findAll().stream()
			.filter(s -> s.getCorsi() == null || s.getCorsi().stream().noneMatch(Corso::isAttivo))
			.count();

		if (studentiSenzaCorso > 0) {
			avvisi.add(Map.of(
				"messaggio", "⚠️ Ci sono " + studentiSenzaCorso + " studenti senza corso attivo.",
				"link", "/studenti"
			));
		}

		long corsiDisattivati = corsoRepository.findAll().stream()
			.filter(c -> !c.isAttivo())
			.count();

		if (corsiDisattivati > 0) {
			avvisi.add(Map.of(
				"messaggio", "📢 " + corsiDisattivati + " corsi sono attualmente disattivati.",
				"link", "/corsi"
			));
		}

		return avvisi;
	}

	public Map<String, Object> getPagamentiMensili() {
		List<Pagamento> pagamenti = pagamentoRepository.findAll();

		Map<Month, Double> mappa = new HashMap<>();
		for (Pagamento pagamento : pagamenti) {
			Month mese = pagamento.getDataPagamento().getMonth();
			mappa.put(mese, mappa.getOrDefault(mese, 0.0) + pagamento.getImporto());
		}

		List<Month> mesiOrdinati = mappa.keySet().stream()
			.sorted(Comparator.comparingInt(Month::getValue))
			.toList();

		List<String> mesi = mesiOrdinati.stream()
			.map(m -> m.getDisplayName(java.time.format.TextStyle.FULL, Locale.ITALIAN))
			.toList();

		List<Double> importi = mesiOrdinati.stream()
			.map(mappa::get)
			.toList();

		return Map.of("mesi", mesi, "importi", importi);
	}

}
