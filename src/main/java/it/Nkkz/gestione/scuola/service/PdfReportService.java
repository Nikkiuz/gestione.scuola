package it.Nkkz.gestione.scuola.service;

import com.itextpdf.kernel.pdf.*;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import it.Nkkz.gestione.scuola.dto.ReportDTO;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.Collections;

@Service
public class PdfReportService {

	// 🔹 Metodo per generare il PDF
	public byte[] generateReportPdf(ReportDTO report) {
		if (report.getOreInsegnate() == null) {
			report.setOreInsegnate(Collections.emptyMap());
		}
		if (report.getPagamentiRicevuti() == null) {
			report.setPagamentiRicevuti(Collections.emptyMap());
		}
		if (report.getSpeseRegistrate() == null) {
			report.setSpeseRegistrate(Collections.emptyMap());
		}

		try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
			PdfWriter writer = new PdfWriter(outputStream);
			PdfDocument pdf = new PdfDocument(writer);
			Document document = new Document(pdf);

			document.add(new Paragraph("Report " + report.getPeriodo())
				.setBold().setFontSize(16));

			document.add(new Paragraph("\nOre Insegnate per Insegnante:"));
			Table tableOre = new Table(2);
			tableOre.addCell("Insegnante");
			tableOre.addCell("Ore Totali");
			report.getOreInsegnate().forEach((insegnante, ore) -> {
				tableOre.addCell(insegnante);
				tableOre.addCell(String.valueOf(ore));
			});
			document.add(tableOre);

			document.add(new Paragraph("\nPagamenti Ricevuti:"));
			Table tablePagamenti = new Table(2);
			tablePagamenti.addCell("Metodo");
			tablePagamenti.addCell("Totale €");
			report.getPagamentiRicevuti().forEach((metodo, totale) -> {
				tablePagamenti.addCell(metodo);
				tablePagamenti.addCell(String.format("%.2f", totale));
			});
			document.add(tablePagamenti);

			document.add(new Paragraph("\nSpese Registrate:"));
			Table tableSpese = new Table(2);
			tableSpese.addCell("Categoria");
			tableSpese.addCell("Totale €");
			report.getSpeseRegistrate().forEach((categoria, totale) -> {
				tableSpese.addCell(categoria);
				tableSpese.addCell(String.format("%.2f", totale));
			});
			document.add(tableSpese);

			document.add(new Paragraph("\nBilancio Totale: " + String.format("%.2f", report.getBilancio()) + " €")
				.setBold().setFontSize(14));

			document.close();
			return outputStream.toByteArray();
		} catch (Exception e) {
			throw new RuntimeException("Errore nella generazione del PDF", e);
		}
	}

}
