package it.Nkkz.gestione.scuola.controller;

import it.Nkkz.gestione.scuola.dto.ReportDTO;
import it.Nkkz.gestione.scuola.service.PdfReportService;
import it.Nkkz.gestione.scuola.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/report")
public class ReportController {

	@Autowired
	private ReportService reportService;

	@Autowired
	private PdfReportService pdfReportService;

	// Ottieni il report mensile di un mese specifico
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@GetMapping("/mensile")
	public ResponseEntity<ReportDTO> getReportMensile(@RequestParam int anno, @RequestParam int mese) {
		return ResponseEntity.ok(reportService.generaReportMensile(anno, mese));
	}

	// Download del Report Mensile
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@GetMapping("/mensile/pdf")
	public ResponseEntity<byte[]> downloadReportMensile(@RequestParam int anno, @RequestParam int mese) {
		ReportDTO report = reportService.generaReportMensile(anno, mese);
		byte[] pdfBytes = pdfReportService.generateReportPdf(report);

		return ResponseEntity.ok()
			.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=report_mensile_" + anno + "_" + mese + ".pdf")
			.contentType(MediaType.APPLICATION_PDF)
			.body(pdfBytes);
	}

	// Download del Report Annuale
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@GetMapping("/annuale/pdf")
	public ResponseEntity<byte[]> downloadReportAnnuale(@RequestParam int anno) {
		ReportDTO report = reportService.generaReportAnnuale(anno);
		byte[] pdfBytes = pdfReportService.generateReportPdf(report);

		return ResponseEntity.ok()
			.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=report_annuale_" + anno + ".pdf")
			.contentType(MediaType.APPLICATION_PDF)
			.body(pdfBytes);
	}

	// 📊 Recupera il report annuale
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@GetMapping("/annuale/{anno}")
	public ReportDTO getReportAnnuale(@PathVariable int anno) {
		return reportService.generaReportAnnuale(anno);
	}

	// 📧 Invia il report annuale via email
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@GetMapping("/annuale/{anno}/email")
	public ResponseEntity<String> inviaReportAnnuale(@PathVariable int anno) {
		String result = reportService.inviaReportAnnuale(anno);
		return ResponseEntity.ok(result);
	}

	// Endpoint per inviare il report via email
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@PostMapping("/mensile/email")
	public String inviaReportMensile(@RequestParam int anno, @RequestParam int mese) {
		reportService.inviaReportMensile(anno, mese);
		return "Email con il report mensile inviata con successo!";
	}
}
