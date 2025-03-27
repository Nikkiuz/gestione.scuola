package it.Nkkz.gestione.scuola.controller;

import it.Nkkz.gestione.scuola.dto.CalendarioDTO;
import it.Nkkz.gestione.scuola.service.CalendarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/calendario")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class CalendarioController {

	@Autowired
	private CalendarioService calendarioService;

	// Ottieni le aule disponibili in un giorno della settimana e orario
	@GetMapping("/aule-disponibili")
	public List<String> getAuleDisponibili(@RequestParam String giorno, @RequestParam String orario) {
		return calendarioService.getAuleDisponibili(giorno, orario);
	}

	// Ottieni i corsi programmati in un certo giorno della settimana
	@GetMapping("/corsi-programmati")
	public List<CalendarioDTO> getCorsiProgrammati(
		@RequestParam String giorno,
		@RequestParam(required = false) Long insegnante,
		@RequestParam(required = false) String livello) {

		return calendarioService.getCorsiSettimanaFiltrati(giorno, insegnante, livello);
	}


	// Segna un corso come interrotto
	@PostMapping("/interrompi-corso/{corsoId}")
	public void interrompiCorso(@PathVariable Long corsoId) {
		calendarioService.interrompiCorso(corsoId);
	}
}
