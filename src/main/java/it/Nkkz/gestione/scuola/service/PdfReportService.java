package it.Nkkz.gestione.scuola.service;

import com.itextpdf.kernel.pdf.*;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import it.Nkkz.gestione.scuola.dto.ReportDTO;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PdfReportService {

	public byte[] generateReportPdf(ReportDTO report) {
		try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
			PdfWriter writer = new PdfWriter(outputStream);
			PdfDocument pdf = new PdfDocument(writer);
			Document document = new Document(pdf);

			// Titolo
			document.add(new Paragraph("Report " + report.getPeriodo() + " - " + LocalDate.now())
				.setBold().setFontSize(16));

			// Ore Insegnate (ordinate per valore decrescente)
			document.add(new Paragraph("\nOre Insegnate per Insegnante:"));
			Table tableOre = new Table(2);
			tableOre.addCell("Insegnante");
			tableOre.addCell("Ore Totali");
			report.getOreInsegnate().entrySet().stream()
				.sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
				.forEach(entry -> {
					tableOre.addCell(entry.getKey());
					tableOre.addCell(String.valueOf(entry.getValue()));
				});
			document.add(tableOre);

			// Pagamenti Ricevuti (ordinati per valore decrescente)
			document.add(new Paragraph("\nPagamenti Ricevuti:"));
			Table tablePagamenti = new Table(2);
			tablePagamenti.addCell("Metodo di Pagamento");
			tablePagamenti.addCell("Totale (€)");
			report.getPagamentiRicevuti().entrySet().stream()
				.sorted(Map.Entry.<String, Double>comparingByValue().reversed())
				.forEach(entry -> {
					tablePagamenti.addCell(entry.getKey());
					tablePagamenti.addCell(String.format("%.2f", entry.getValue()));
				});
			document.add(tablePagamenti);

			// Spese Registrate (ordinate per valore decrescente)
			document.add(new Paragraph("\nSpese Registrate:"));
			Table tableSpese = new Table(2);
			tableSpese.addCell("Categoria");
			tableSpese.addCell("Totale (€)");
			report.getSpeseRegistrate().entrySet().stream()
				.sorted(Map.Entry.<String, Double>comparingByValue().reversed())
				.forEach(entry -> {
					tableSpese.addCell(entry.getKey());
					tableSpese.addCell(String.format("%.2f", entry.getValue()));
				});
			document.add(tableSpese);

			// Bilancio finale
			document.add(new Paragraph("\nBilancio Totale: " + String.format("%.2f", report.getBilancio()) + " €")
				.setBold().setFontSize(14));

			// Riepilogo
			document.add(new Paragraph("\n🧾 Riepilogo generale:"));
			document.add(new Paragraph("Totale entrate: " + String.format("%.2f", report.getTotaleEntrate()) + " €"));
			document.add(new Paragraph("Totale uscite: " + String.format("%.2f", report.getTotaleUscite()) + " €"));
			document.add(new Paragraph("Bilancio netto: " + String.format("%.2f", report.getBilancio()) + " €"));

			document.close();
			return outputStream.toByteArray();

		} catch (Exception e) {
			throw new RuntimeException("Errore nella generazione del PDF", e);
		}
	}
}
