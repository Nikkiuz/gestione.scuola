package it.Nkkz.gestione.scuola.service;

import it.Nkkz.gestione.scuola.dto.ReportDTO;
import it.Nkkz.gestione.scuola.entity.Corso;
import it.Nkkz.gestione.scuola.repository.CorsoRepository;
import it.Nkkz.gestione.scuola.repository.PagamentoRepository;
import it.Nkkz.gestione.scuola.repository.SpesaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportService {

	@Autowired
	private CorsoRepository corsoRepository;

	@Autowired
	private PagamentoRepository pagamentoRepository;

	@Autowired
	private SpesaRepository spesaRepository;

	@Autowired
	private EmailService emailService;

	@Autowired
	private PdfReportService pdfReportService;

	@Value("${spring.mail.username}")
	private String adminEmail;

	// Genera il report mensile per un mese specifico
	public ReportDTO generaReportMensile(int anno, int mese) {
		YearMonth yearMonth = YearMonth.of(anno, mese);
		LocalDate startDate = yearMonth.atDay(1);
		LocalDate endDate = yearMonth.atEndOfMonth();
		return generaReport(startDate, endDate, "Mensile");
	}

	// Genera il report annuale per un anno specifico
	public ReportDTO generaReportAnnuale(int anno) {
		LocalDate startDate = LocalDate.of(anno, 1, 1);
		LocalDate endDate = LocalDate.of(anno, 12, 31);
		return generaReport(startDate, endDate, "Annuale");
	}

	// Metodo generico per generare un report
	private ReportDTO generaReport(LocalDate startDate, LocalDate endDate, String periodo) {
		ReportDTO report = new ReportDTO();
		report.setPeriodo(periodo);

		// Ore insegnate per insegnante
		Map<String, Integer> oreInsegnate = calcolaOreInsegnateNelPeriodo(startDate, endDate);
		report.setOreInsegnate(oreInsegnate);

		// Totale pagamenti ricevuti per metodo di pagamento
		Map<String, Double> pagamentiRicevuti = pagamentoRepository.findByDataPagamentoBetween(startDate, endDate)
			.stream()
			.collect(Collectors.groupingBy(
				p -> p.getMetodoPagamento().toString(),
				Collectors.summingDouble(p -> p.getImporto())
			));
		report.setPagamentiRicevuti(pagamentiRicevuti.isEmpty() ? Collections.emptyMap() : pagamentiRicevuti);

		// Totale spese registrate per categoria
		Map<String, Double> speseRegistrate = spesaRepository.findByDataSpesaBetween(startDate, endDate)
			.stream()
			.collect(Collectors.groupingBy(
				s -> s.getCategoria().toString(),
				Collectors.summingDouble(s -> s.getImporto())
			));
		report.setSpeseRegistrate(speseRegistrate.isEmpty() ? Collections.emptyMap() : speseRegistrate);

		// Calcolo bilancio (entrate - uscite)
		double totaleEntrate = pagamentiRicevuti.values().stream().mapToDouble(Double::doubleValue).sum();
		double totaleUscite = speseRegistrate.values().stream().mapToDouble(Double::doubleValue).sum();
		report.setBilancio(totaleEntrate - totaleUscite);

		return report;
	}

	// Calcola il numero di ore insegnate nel periodo
	private Map<String, Integer> calcolaOreInsegnateNelPeriodo(LocalDate startDate, LocalDate endDate) {
		Map<String, Integer> oreInsegnate = new HashMap<>();

		List<Corso> corsi = corsoRepository.findByAttivoTrue();
		for (Corso corso : corsi) {
			String chiaveInsegnante = corso.getInsegnante().getNome() + " " + corso.getInsegnante().getCognome();
			int orePerSettimana = corso.getFrequenza().equals("2 volte a settimana") ? 6 : 3;

			// Calcoliamo quante settimane ci sono nel periodo
			long settimaneNelPeriodo = startDate.datesUntil(endDate.plusDays(1))
				.filter(date -> date.getDayOfWeek().toString().equalsIgnoreCase(corso.getGiorno()))
				.count();

			int totaleOre = (int) (orePerSettimana * settimaneNelPeriodo);
			oreInsegnate.put(chiaveInsegnante, oreInsegnate.getOrDefault(chiaveInsegnante, 0) + totaleOre);
		}

		return oreInsegnate.isEmpty() ? Collections.emptyMap() : oreInsegnate;
	}

	// Genera e invia il report mensile via email
	public String inviaReportMensile(int anno, int mese) {
		ReportDTO report = generaReportMensile(anno, mese);

		// Controllo se il report è vuoto
		if (report.getOreInsegnate().isEmpty() &&
			report.getPagamentiRicevuti().isEmpty() &&
			report.getSpeseRegistrate().isEmpty()) {
			return "⚠️ Nessun dato disponibile per il report mensile di " + mese + "/" + anno;
		}

		byte[] pdfBytes = pdfReportService.generateReportPdf(report);

		String subject = "📊 Report Mensile - " + mese + "/" + anno;
		String body = "Ciao,\n\nIn allegato trovi il report mensile della scuola per " + mese + "/" + anno + ".\n\nSaluti,\nGestione Scuola";

		emailService.sendEmailWithAttachment(adminEmail, subject, body, pdfBytes, "report_mensile_" + anno + "_" + mese + ".pdf");

		return "✅ Email con il report mensile inviata con successo!";
	}
}
