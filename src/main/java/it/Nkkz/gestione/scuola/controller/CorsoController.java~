package it.Nkkz.gestione.scuola.controller;

import it.Nkkz.gestione.scuola.dto.CorsoRequestDTO;
import it.Nkkz.gestione.scuola.dto.CorsoResponseDTO;
import it.Nkkz.gestione.scuola.service.CorsoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/corsi")
public class CorsoController {

	private final CorsoService corsoService;

	public CorsoController(CorsoService corsoService) {
		this.corsoService = corsoService;
	}

	// ✅ SOLO ADMIN - Recupera tutti i corsi
	@GetMapping
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<List<CorsoResponseDTO>> getAllCorsi() {
		return ResponseEntity.ok(corsoService.getAllCorsi());
	}

	// ✅ ADMIN & INSEGNANTE - Recupera un corso per ID
	@GetMapping("/{id}")
	@PreAuthorize("hasRole('ROLE_ADMIN') or @corsoService.isInsegnanteOfCorso(authentication.principal.id, #id)")
	public ResponseEntity<CorsoResponseDTO> getCorsoById(@PathVariable Long id, Authentication authentication) {
		return ResponseEntity.ok(corsoService.getCorsoById(id));
	}

	// ✅ SOLO ADMIN - Crea un corso manualmente
	@PostMapping
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@ResponseStatus(HttpStatus.CREATED)
	public CorsoResponseDTO createCorso(@RequestBody CorsoRequestDTO corsoRequestDTO) {
		return corsoService.createCorso(corsoRequestDTO);
	}

	// ✅ SOLO ADMIN - Modifica un corso
	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<CorsoResponseDTO> updateCorso(@PathVariable Long id, @RequestBody CorsoRequestDTO corsoRequestDTO) {
		return ResponseEntity.ok(corsoService.updateCorso(id, corsoRequestDTO));
	}

	// ✅ SOLO ADMIN - Elimina un corso
	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void deleteCorso(@PathVariable Long id) {
		corsoService.deleteCorso(id);
	}

	// ✅ SOLO ADMIN - Genera corsi automaticamente
	@PostMapping("/genera-automaticamente")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@ResponseStatus(HttpStatus.CREATED)
	public void generaCorsiAutomaticamente() {
		corsoService.generaCorsiAutomaticamente();
	}

	// ✅ SOLO ADMIN - Gestisce corsi pieni (dividere o aggiungere posti)
	@PostMapping("/{id}/gestisci-pieno/{opzione}")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public void gestisciCorsoPieno(@PathVariable Long id, @PathVariable int opzione) {
		corsoService.gestisciCorsoPieno(id, opzione);
	}
}
