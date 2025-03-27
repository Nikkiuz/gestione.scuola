package it.Nkkz.gestione.scuola.service;

import it.Nkkz.gestione.scuola.entity.Corso;
import it.Nkkz.gestione.scuola.entity.Pagamento;
import it.Nkkz.gestione.scuola.repository.CorsoRepository;
import it.Nkkz.gestione.scuola.repository.PagamentoRepository;
import it.Nkkz.gestione.scuola.repository.StudenteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Month;
import java.util.*;
import java.util.stream.Collectors;

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

		long corsiConPochiStudenti = corsoRepository.findByAttivoTrue().stream()
			.filter(c -> c.getStudenti().size() < 3)
			.count();

		if (corsiConPochiStudenti > 0) {
			avvisi.add(Map.of(
				"messaggio", "👥 " + corsiConPochiStudenti + " corsi hanno meno di 3 studenti.",
				"link", "/corsi"
			));
		}

		long studentiConPagamentiMancanti = studenteRepository.findAll().stream()
			.filter(s -> pagamentoRepository.findByStudenteId(s.getId()).isEmpty())
			.count();

		if (studentiConPagamentiMancanti > 0) {
			avvisi.add(Map.of(
				"messaggio", "💸 " + studentiConPagamentiMancanti + " studenti non hanno ancora effettuato alcun pagamento.",
				"link", "/studenti"
			));
		}

		return avvisi;
	}

	public Map<String, Object> getPagamentiMensili() {
		List<Pagamento> pagamenti = pagamentoRepository.findAll();
		Map<Month, Double> mappa = new LinkedHashMap<>();

		// Inizializza tutti i mesi con 0.0
		for (Month m : Month.values()) {
			mappa.put(m, 0.0);
		}

		int annoCorrente = java.time.Year.now().getValue();
		java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("MMMM yyyy", Locale.ITALIAN);

		for (Pagamento pagamento : pagamenti) {
			String mensilita = pagamento.getMensilitaSaldata(); // es: "Gennaio 2025"
			try {
				// Aggiungo "01 " per creare una data completa tipo "01 Gennaio 2025"
				LocalDate data = LocalDate.parse("01 " + mensilita, java.time.format.DateTimeFormatter.ofPattern("dd MMMM yyyy", Locale.ITALIAN));
				if (data.getYear() == annoCorrente) {
					Month mese = data.getMonth();
					mappa.put(mese, mappa.get(mese) + pagamento.getImporto());
				}
			} catch (Exception e) {
				System.out.println("Errore parsing mensilità: " + mensilita);
			}
		}

		// Trasforma la mappa in due liste ordinate
		List<String> mesi = mappa.keySet().stream()
			.map(m -> m.getDisplayName(java.time.format.TextStyle.FULL, Locale.ITALIAN))
			.collect(Collectors.toList());

		List<Double> importi = new ArrayList<>(mappa.values());

		return Map.of("mesi", mesi, "importi", importi);
	}

}

