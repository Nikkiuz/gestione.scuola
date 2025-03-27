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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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

<<<<<<< Updated upstream
	// 🔹 Genera il report mensile per un mese specifico
=======
	//Genera il report mensile
>>>>>>> Stashed changes
	public ReportDTO generaReportMensile(int anno, int mese) {
		YearMonth yearMonth = YearMonth.of(anno, mese);
		LocalDate startDate = yearMonth.atDay(1);
		LocalDate endDate = yearMonth.atEndOfMonth();

		return generaReport(startDate, endDate, "Mensile");
	}

<<<<<<< Updated upstream
	// 🔹 Genera il report annuale per un anno specifico
=======
	//Genera il report annuale
>>>>>>> Stashed changes
	public ReportDTO generaReportAnnuale(int anno) {
		LocalDate startDate = LocalDate.of(anno, 1, 1);
		LocalDate endDate = LocalDate.of(anno, 12, 31);

		return generaReport(startDate, endDate, "Annuale");
	}

<<<<<<< Updated upstream
	// 🔹 Metodo generico per generare un report
=======
	//Metodo generico per generare un report
>>>>>>> Stashed changes
	private ReportDTO generaReport(LocalDate startDate, LocalDate endDate, String periodo) {
		ReportDTO report = new ReportDTO();
		report.setPeriodo(periodo);

<<<<<<< Updated upstream
		// 🔹 Ore insegnate per insegnante
		Map<String, Integer> oreInsegnate = calcolaOreInsegnateNelPeriodo(startDate, endDate);
		report.setOreInsegnate(oreInsegnate);

		// 🔹 Totale pagamenti ricevuti per metodo di pagamento
		Map<String, Double> pagamentiRicevuti = pagamentoRepository.findByDataPagamentoBetween(startDate, endDate).stream()
=======
		//Ore insegnate per insegnante
		Map<String, Integer> oreInsegnate = calcolaOreInsegnateNelPeriodo(startDate, endDate);
		report.setOreInsegnate(oreInsegnate);

		//Totale ore insegnate
		int totaleOreInsegnate = oreInsegnate.values().stream().mapToInt(Integer::intValue).sum();
		report.setTotaleOreInsegnate(totaleOreInsegnate);

		//Entrate basate su mensilità saldata
		String targetMeseAnno = formatMeseAnno(startDate);

		List<Pagamento> pagamenti = pagamentoRepository.findAll().stream()
			.filter(p -> p.getMensilitaSaldata() != null &&
				p.getMensilitaSaldata().toLowerCase().endsWith(String.valueOf(endDate.getYear())))
			.collect(Collectors.toList());


		Map<String, Double> pagamentiRicevuti = pagamenti.stream()
>>>>>>> Stashed changes
			.collect(Collectors.groupingBy(
				p -> p.getMetodoPagamento().toString(),
				Collectors.summingDouble(p -> p.getImporto())
			));
		report.setPagamentiRicevuti(pagamentiRicevuti);

<<<<<<< Updated upstream
		// 🔹 Totale spese registrate per categoria
		Map<String, Double> speseRegistrate = spesaRepository.findByDataSpesaBetween(startDate, endDate).stream()
=======
		//Uscite (filtrate per data)
		List<Spesa> spese = spesaRepository.findByDataSpesaBetween(startDate, endDate);
		Map<String, Double> speseRegistrate = spese.stream()
>>>>>>> Stashed changes
			.collect(Collectors.groupingBy(
				s -> s.getCategoria().toString(),
				Collectors.summingDouble(s -> s.getImporto())
			));
		report.setSpeseRegistrate(speseRegistrate);

<<<<<<< Updated upstream
		// 🔹 Calcolo bilancio (entrate - uscite)
=======
		//Totali
>>>>>>> Stashed changes
		double totaleEntrate = pagamentiRicevuti.values().stream().mapToDouble(Double::doubleValue).sum();
		double totaleUscite = speseRegistrate.values().stream().mapToDouble(Double::doubleValue).sum();
		report.setBilancio(totaleEntrate - totaleUscite);

<<<<<<< Updated upstream
		return report;
	}

	// 🔹 Calcola il numero di ore insegnate nel periodo
=======
		//Debug
		System.out.println("📊 Report generato:");
		System.out.println("💰 Totale Entrate: " + totaleEntrate);
		System.out.println("📉 Totale Uscite: " + totaleUscite);
		System.out.println("📈 Bilancio Finale: " + report.getBilancio());
		System.out.println("🕒 Totale Ore Insegnate: " + totaleOreInsegnate);

		return report;
	}

	//Calcola ore insegnate per insegnante nel periodo
>>>>>>> Stashed changes
	private Map<String, Integer> calcolaOreInsegnateNelPeriodo(LocalDate startDate, LocalDate endDate) {
		Map<String, Integer> oreInsegnate = new HashMap<>();

		List<Corso> corsi = corsoRepository.findAll();

		for (Corso corso : corsi) {
			// Se il corso è attivo e si svolge nel periodo considerato
			if (corso.isAttivo()) {
				String chiaveInsegnante = corso.getInsegnante().getNome() + " " + corso.getInsegnante().getCognome();
				int orePerSettimana = corso.getFrequenza().equals("2 volte a settimana") ? 6 : 3;

				// Calcoliamo quante settimane ci sono nel periodo
				long settimaneNelPeriodo = startDate.datesUntil(endDate.plusDays(1))
					.filter(date -> date.getDayOfWeek().toString().equalsIgnoreCase(corso.getGiorno()))
					.count();

<<<<<<< Updated upstream
				int totaleOre = (int) (orePerSettimana * settimaneNelPeriodo);
				oreInsegnate.put(chiaveInsegnante, oreInsegnate.getOrDefault(chiaveInsegnante, 0) + totaleOre);
			}
=======
			long settimaneNelPeriodo = startDate.datesUntil(endDate.plusDays(1))
				.filter(date -> date.getDayOfWeek().toString().equalsIgnoreCase(corso.getGiorno()))
				.count();

			int totaleOre = (int) (orePerSettimana * settimaneNelPeriodo);
			oreInsegnate.put(chiaveInsegnante, oreInsegnate.getOrDefault(chiaveInsegnante, 0) + totaleOre);
		}

		return oreInsegnate.isEmpty() ? Collections.emptyMap() : oreInsegnate;
	}

	//Calcola ore insegnate per insegnante in un dato anno
	public Map<String, Integer> calcolaOreInsegnateAnnuali(int anno) {
		LocalDate startDate = LocalDate.of(anno, 1, 1);
		LocalDate endDate = LocalDate.of(anno, 12, 31);
		Map<String, Integer> oreInsegnate = new HashMap<>();
		List<Corso> corsi = corsoRepository.findByAttivoTrue();

		for (Corso corso : corsi) {
			if (corso.getInsegnante() == null) continue;

			String chiaveInsegnante = corso.getInsegnante().getNome() + " " + corso.getInsegnante().getCognome();
			int orePerSettimana = corso.getFrequenza().equals("2 volte a settimana") ? 6 : 3;

			long settimaneNelPeriodo = startDate
				.datesUntil(endDate.plusDays(1))
				.filter(data -> data.getDayOfWeek().toString().equalsIgnoreCase(corso.getGiorno()))
				.count();

			int totaleOre = (int) (orePerSettimana * settimaneNelPeriodo);
			oreInsegnate.put(chiaveInsegnante, oreInsegnate.getOrDefault(chiaveInsegnante, 0) + totaleOre);
>>>>>>> Stashed changes
		}

		return oreInsegnate;
	}

<<<<<<< Updated upstream
	// 🔹 Genera e invia il report mensile via email
	public void inviaReportMensile(int anno, int mese) {
=======

	//Utility per formattare una data in "marzo 2024" (lowercase)
	private String formatMeseAnno(LocalDate data) {
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM yyyy", new Locale("it"));
		return data.format(formatter).toLowerCase();
	}

	//Genera e invia il report mensile via email
	public String inviaReportMensile(int anno, int mese) {
>>>>>>> Stashed changes
		ReportDTO report = generaReportMensile(anno, mese);
		byte[] pdfBytes = pdfReportService.generateReportPdf(report);

		String subject = "📊 Report Mensile - " + mese + "/" + anno;
		String body = "Ciao,\n\nIn allegato trovi il report mensile della scuola per " + mese + "/" + anno + ".\n\nSaluti,\nGestione Scuola";

		emailService.sendEmailWithAttachment(adminEmail, subject, body, pdfBytes, "report_mensile_" + anno + "_" + mese + ".pdf");
<<<<<<< Updated upstream
=======

		return "✅ Email con il report mensile inviata con successo!";
	}

	//Invia il report annuale via email
	public String inviaReportAnnuale(int anno) {
		ReportDTO report = generaReportAnnuale(anno);

		if (report.getOreInsegnate().isEmpty() &&
			report.getPagamentiRicevuti().isEmpty() &&
			report.getSpeseRegistrate().isEmpty()) {
			return "⚠️ Nessun dato disponibile per il report annuale del " + anno;
		}

		byte[] pdfBytes = pdfReportService.generateReportPdf(report);
		String subject = "📊 Report Annuale - " + anno;
		String body = "Ciao,\n\nIn allegato trovi il report annuale della scuola per l'anno " + anno + ".\n\nSaluti,\nGestione Scuola";

		emailService.sendEmailWithAttachment(adminEmail, subject, body, pdfBytes, "report_annuale_" + anno + ".pdf");

		return "✅ Email con il report annuale inviata con successo!";
>>>>>>> Stashed changes
	}
}
