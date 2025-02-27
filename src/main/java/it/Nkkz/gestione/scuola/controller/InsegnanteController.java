package it.Nkkz.gestione.scuola.controller;

import it.Nkkz.gestione.scuola.entity.Insegnante;
import it.Nkkz.gestione.scuola.service.InsegnanteService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/insegnanti")
public class InsegnanteController {

	private final InsegnanteService insegnanteService;

	public InsegnanteController(InsegnanteService insegnanteService) {
		this.insegnanteService = insegnanteService;
	}

	// ✅ L'Admin può vedere tutti gli insegnanti
	@GetMapping
	@ResponseStatus(HttpStatus.OK)
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public List<Insegnante> getAllInsegnanti() {
		return insegnanteService.getAllInsegnanti();
	}

	// ✅ Un insegnante può vedere SOLO se stesso. L'Admin può vedere tutto.
	@GetMapping("/{id}")
	@ResponseStatus(HttpStatus.OK)
	@PreAuthorize("hasRole('ROLE_ADMIN') or #id == authentication.principal.id")
	public Insegnante getInsegnanteById(@PathVariable Long id) {
		return insegnanteService.getInsegnanteById(id);
	}

	// ✅ Un insegnante può aggiornare tutti i suoi dati. L'Admin può modificare tutto.
	@PutMapping("/{id}")
	@ResponseStatus(HttpStatus.OK)
	@PreAuthorize("hasRole('ROLE_ADMIN') or #id == authentication.principal.id")
	public Insegnante updateInsegnante(@PathVariable Long id, @RequestBody Insegnante insegnanteDetails) {
		return insegnanteService.updateInsegnante(id, insegnanteDetails);
	}

	// ✅ SOLO L'ADMIN può eliminare un insegnante
	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public void deleteInsegnante(@PathVariable Long id) {
		insegnanteService.deleteInsegnante(id);
	}
}
