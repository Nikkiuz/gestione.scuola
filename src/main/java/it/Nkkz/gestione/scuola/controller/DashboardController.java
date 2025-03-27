package it.Nkkz.gestione.scuola.controller;

import it.Nkkz.gestione.scuola.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

	private final DashboardService dashboardService;

	public DashboardController(DashboardService dashboardService) {
		this.dashboardService = dashboardService;
	}

	@GetMapping("/stats")
	public ResponseEntity<Map<String, Object>> getStats() {
		return ResponseEntity.ok(dashboardService.getStats());
	}

	@GetMapping("/avvisi")
	public ResponseEntity<List<Map<String, String>>> getAvvisi() {
		return ResponseEntity.ok(dashboardService.getAvvisi());
	}

	@GetMapping("/pagamenti-mensili")
	public ResponseEntity<Map<String, Object>> getPagamentiMensili() {
		return ResponseEntity.ok(dashboardService.getPagamentiMensili());
	}
}
